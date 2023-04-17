import makeWebhookRequest from "./makeWebhookReq";
import { update as updateUser, removeStale as removeStaleUsers, getAllUsers, getUsers, CachedUser } from "cache/users";
import { TeamId, UserId, teamIdToStr, userIdToStr } from "cache/ids";
import { DbUserMeta, dbToCacheUser } from "./db-types";

const syncAllUsers = async (): Promise<CachedUser[] | null> => {
    try {
        const allUsers = await makeWebhookRequest<DbUserMeta[]>({
            section: "user",
            query: { __tag: "get_all" },
        });
        if (!allUsers.sql.success) throw allUsers.sql.error;
        const users = allUsers.sql.output.map(dbToCacheUser).flatMap(c => c ? [c] : []);
        const usedIds = users.map(u => u.userId);
        await removeStaleUsers(usedIds);

        await Promise.all(users.map(updateUser));

        return await getAllUsers();
    } catch (err) {
        console.error("failed to rerequest users", err);
    }

    return null;
};

const syncUser = async ({ id }: { id: UserId }): Promise<CachedUser | null> => {
    try {
        const userRes = await makeWebhookRequest<DbUserMeta>({ section: "user", query: { __tag: "get", id: userIdToStr(id) } });
        if (!userRes.sql.success) throw userRes.sql.error;

        const user = dbToCacheUser(userRes.sql.output);
        if (user) {
            await updateUser(user);
            const users = await getUsers([user.userId]);
            return users[0] ?? null;
        } else console.error("Bad SQL return:", userRes);
    } catch (err) {
        console.error("failed to rerequest users", err);
    }

    return null;
};


type AddNewUserParams = {
    email: string;
    name: string;
    password: string;
    eligible: boolean;
};
const addUser = async ({ email, name, password, eligible }: AddNewUserParams) => {
    try {
        const newUserRes = await makeWebhookRequest<DbUserMeta>({
            section: "user",
            query: {
                __tag: "create",
                email, name, password, eligible,
            },
        });
        if (!newUserRes.sql.success) throw newUserRes.sql.error;

        const newUser = dbToCacheUser(newUserRes.sql.output);

        if (newUser) {
            await updateUser(newUser);
            return true;
        } else console.error("Bad SQL return:", newUserRes);
    } catch (err) {
        console.error("failed to add new user", err);
    }

    return false;
};


type UpdateUserParams = {
    id: UserId;
    
    name: string;
    password: string;
    newPassword: string | null;
    eligible: boolean;
};
const updateUserDb = async ({ id, name, password, newPassword, eligible }: UpdateUserParams): Promise<CachedUser | null> => {
    try {
        const result = await makeWebhookRequest<DbUserMeta>({
            section: "user",
            query: {
                __tag: "update",
                id: userIdToStr(id),
                name,
                password,
                newPassword,
                eligible,
            }
        });
        if (!result.sql.success) throw result;
        
        const user = dbToCacheUser(result.sql.output);
        if (user) {
            await updateUser(user);
            const users = await getUsers([user.userId]);
            return users[0] ?? null;
        } else console.error("Bad SQL return:", result);
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }
    return null;
};

type JoinTeamParams = {
    id: UserId;
    password: string;
    teamId: TeamId;
    teamPassword: string;
};
const joinTeam = async ({ id, password, teamId, teamPassword }: JoinTeamParams): Promise<CachedUser | null> => {
    try {
        const joinedUser = await makeWebhookRequest<DbUserMeta>({
            section: "user",
            query: {
                __tag: "join",
                id: userIdToStr(id), password, teamId: teamIdToStr(teamId), teamPassword,
            },
        });
        if (!joinedUser.sql.success) throw joinedUser.sql.error;
        const user = dbToCacheUser(joinedUser.sql.output);

        if (user) {
            updateUser(user);
            const users = await getUsers([user.userId]);
            return users[0] ?? null;
        } else console.error("Bad SQL return:", joinedUser);
    } catch (err) {
        console.error("failed to rerequest teams", err);
    }
    return null;
};

export {
    syncAllUsers, syncUser,
    addUser, updateUserDb, joinTeam,
};
