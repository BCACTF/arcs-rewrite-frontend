import makeWebhookRequest from "./makeWebhookReq";
import { update as updateUser, parseUser, removeStale as removeStaleUsers, getAllUsers, getUsers, CachedUser } from "cache/users";
import { TeamId, UserId, teamIdToStr, userIdToStr } from "cache/ids";
import escape from "pg-escape";
import { DbUserMeta } from "./queries";
import { CachedChall } from "cache/challs";

const jsonToObj = (json: unknown) => {
    if (typeof json !== "object" || json === null || Array.isArray(json)) return null;
    const {
        id: userId,
        email,
        name,
        team_id: teamId,

        score,
        last_solve: lastSolve,

        eligible,
        admin,
    } = json as Record<string, unknown>;
    const userFmt = {
        userId, email, eligible, admin, teamId,
        clientSideMetadata: { name, userId, teamId, score, lastSolve, eligible, admin },
    };
    return parseUser(JSON.stringify(userFmt));
};

type GetAllUsersReq = () => Promise<CachedUser[] | null>;
const requestAllUsers: GetAllUsersReq = async () => {
    try {
        const outputList = await makeWebhookRequest({ section: "user", query: { __tag: "get_all" } });
        if (Array.isArray(outputList)) {
            const allUsers = outputList.map(jsonToObj).flatMap(c => c ? [c] : []);
            const usedIds = allUsers.map(u => u.userId);
            await removeStaleUsers(usedIds);

            await Promise.all(allUsers.map(updateUser));

            return await getAllUsers();
        } else {
            console.error("Bad format:", outputList);
        }
    } catch (err) {
        console.error("failed to rerequest users", err);
    }

    return null;
};

type AddNewUserReq = (params: {
    email: string;
    name: string;
    password: string;
    eligible: boolean;
}) => Promise<boolean>;

const addNewUser: AddNewUserReq = async ({ email, name, password, eligible }) => {
    try {
        const newUser = await makeWebhookRequest({
            section: "user",
            query: {
                __tag: "create",
                email, name, password, eligible,
            },
        });
        const user = jsonToObj(newUser);

        if (user !== null) {
            await updateUser(user);
            return true;
        } else console.error("Bad SQL return:", newUser);
    } catch (err) {
        console.error("failed to add new user", err);
    }

    return false;
};

type UpdateUserFromDbReq = (params: {
    id: UserId;
}) => Promise<CachedUser | null>;

const updateUserFromDb: UpdateUserFromDbReq = async ({ id }) => {
    try {
        const output = await makeWebhookRequest({ section: "user", query: { __tag: "get", id: userIdToStr(id) } });
        const user = jsonToObj(output);
        if (user) {
            await updateUser(user);
            const users = await getUsers([user.userId]);
            return users[0] ?? null;
        } else {
            console.error("Bad format:", output);
        }
    } catch (err) {
        console.error("failed to rerequest users", err);
    }

    return null;
};

type UpdateUserReq = (params: {
    email: string;
    name: string;
    password: string;
    eligible: boolean;
}) => Promise<boolean>;

const updateDbUser: UpdateUserReq = async ({ userId, teamId, score }) => {
    const tIdTxt = teamId ? `team_id = ${teamIdToStr(teamId)}` : "";
    const scrTxt = score ? `team_id = ${score}` : "";
    const query = `
    UPDATE users 
    SET ${[tIdTxt, scrTxt].flatMap(t => t === "" ? [] : [t]).join(", ")}
    WHERE id = ${userIdToStr(userId)}`.split("\n").join(" ");

    try {
        await makeWebhookRequest(query);
        // else console.error("Bad format:", json, "\nResponse: ", response);
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }
    return false;
};

export {
    requestAllUsers,
    addNewUser,
    updateDbUser,
    updateUserFromDbByName,
    updateUserFromDb,
};
