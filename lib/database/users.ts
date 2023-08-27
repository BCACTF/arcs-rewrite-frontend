import makeWebhookRequest from "./makeWebhookReq";
import { update as updateUser, removeStale as removeStaleUsers, getAllUsers, getUsers, CachedUser } from "cache/users";
import { UserId, fmtLogU, userIdToStr } from "cache/ids";
import { dbToCacheUser } from "./db-types";
import { Auth } from "./queries/users";
import addClientPerms from "auth/webhookClientAuthPerms";
import { apiLogger } from "logging";

export type InputAuth = (Auth & { __type: "pass" }) | Omit<Auth & { __type: "oauth" }, "oauth_allow_token">;

const syncAllUsers = async (): Promise<CachedUser[] | null> => {
    try {
        const allUsers = await makeWebhookRequest("user_arr", {
            __type: "user",
            query_name: "get_all",
        });
        const users = allUsers.map(dbToCacheUser).flatMap(c => c ? [c] : []);
        apiLogger.debug`Got users: ${users.map(u => `${fmtLogU(u.userId)} (${u.clientSideMetadata.name})`)}`;

        const usedIds = users.map(u => u.userId);
        await removeStaleUsers(usedIds);
        apiLogger.trace`Removed stale users`;
        
        const replaced = await Promise.all(users.map(updateUser));
        apiLogger.trace`Updated all users`;
        
        apiLogger.debug`Replaced users: ${replaced.flatMap(u => u ? [fmtLogU(u.userId)] : [])}`;
        
        
        const newUsers = await getAllUsers();
        apiLogger.debug`Users: ${newUsers.map(u => u.clientSideMetadata.name)}`;
        return newUsers;
    } catch (err) {
        apiLogger.error`Failed to rerequest users: ${err}`;
    }

    return null;
};

const syncUser = async ({ id }: { id: UserId }): Promise<CachedUser | null> => {
    try {
        const userData = await makeWebhookRequest("user", {
            __type: "user",
            query_name: "get",
            id: userIdToStr(id),
        });
        const user = dbToCacheUser(userData);
        if (user) {
            await updateUser(user);
            const users = await getUsers([user.userId]);
            return users[0] ?? null;
        } else console.error("Bad SQL return:", userData);
    } catch (err) {
        console.error("failed to rerequest users", err);
    }

    return null;
};

type CheckUsernameAvailableParams = {
    name: string;
}
const checkUsernameAvailable = async ({ name }: CheckUsernameAvailableParams): Promise<boolean> => {
    try {
        return makeWebhookRequest("availability", {
            __type: "user",
            query_name: "available",
            name,
        });
    } catch (err) {
        console.error("failed to check username availability", err);
        return false;
    }
};

type CheckUserOauthParams = {
    id: UserId;
    auth: InputAuth & { __type: "oauth" };
}
const checkUserOauth = async ({ id, auth }: CheckUserOauthParams): Promise<boolean> => {
    try {
        const userData = await makeWebhookRequest("auth_status", {
            __type: "user",
            query_name: "check_auth",
            id: userIdToStr(id),
            auth: await addClientPerms(auth),
        });
        return userData;
    } catch (err) {
        console.error("failed to rerequest users", err);
        return false;
    }
};


type AddNewUserParams = {
    email: string;
    name: string;
    auth: InputAuth;
    eligible: boolean;
};
const addUser = async ({ email, name, auth, eligible }: AddNewUserParams) => {
    try {
        
        const newUserRes = await makeWebhookRequest("user", {
            __type: "user",
            query_name: "create",
            email, name, eligible, admin: false,
            auth: await addClientPerms(auth),
        });
        const newUser = dbToCacheUser(newUserRes);

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
    auth: Auth;
    newPassword: string | null;
    eligible: boolean;
};
const updateUserDb = async ({ id, name, auth, newPassword, eligible }: UpdateUserParams): Promise<CachedUser | null> => {
    // try {
    //     const updatedData = await makeWebhookRequest<DbUserMeta>({
    //         __type: "user",
    //         query_name: "update",
    //         id: userIdToStr(id),
    //         name,
    //         auth,
    //         newPassword,
    //         eligible,
    //     });        
    //     const user = dbToCacheUser(updatedData);
    //     if (user) {
    //         await updateUser(user);
    //         const users = await getUsers([user.userId]);
    //         return users[0] ?? null;
    //     } else console.error("Bad SQL return:", updatedData);
    // } catch (err) {
    //     console.error("failed to rerequest challenges", err);
    // }
    return null;
};

type JoinTeamParams = {
    id: UserId;
    auth: InputAuth;
    teamName: string;
    teamPassword: string;
};
const joinTeam = async ({ id, auth, teamName, teamPassword }: JoinTeamParams): Promise<CachedUser | null> => {
    try {
        const joinedUser = await makeWebhookRequest("user", {
            __type: "user",
            query_name: "join",
            id: userIdToStr(id),
            auth: await addClientPerms(auth),
            team_name: teamName,
            team_pass: teamPassword,
        });
        const user = dbToCacheUser(joinedUser);

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
    addUser,
    checkUsernameAvailable, checkUserOauth,
    updateUserDb, joinTeam,
};
