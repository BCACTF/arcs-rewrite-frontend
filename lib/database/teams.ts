import makeWebhookRequest from "./makeWebhookReq";
import { CachedTeamMeta, getAllTeams, getTeams, removeStale as removeStaleTeams, update as updateTeamCache } from "cache/teams";
import { TeamId, UserId, teamIdToStr, userIdToStr } from "cache/ids";
import { DbTeamMeta, dbToCacheTeam } from "./db-types";
import { syncUser } from "./users";
import { apiLogger } from "logging";

const syncAllTeams = async (): Promise<CachedTeamMeta[] | null> => {
    apiLogger.trace`Syncing all teams...`;
    
    try {
        const allTeams = await makeWebhookRequest("team_arr", {
            __type: "team",
            query_name: "get_all",
        });

        const teams = allTeams.map(dbToCacheTeam).flatMap(c => c ? [c] : []);

        apiLogger.trace`Cache teams: ${teams.map(t => t.name)}`;

        const usedIds = teams.map(t => t.id);
        removeStaleTeams(usedIds);

        await Promise.all(teams.map(updateTeamCache));

        apiLogger.info`Successfully recached teams`;

        return await getAllTeams();

    } catch (err) {
        console.error("failed to rerequest teams", err);
    }
    return null;
};

const syncTeam = async ({ id }: { id: TeamId }): Promise<CachedTeamMeta | null> => {
    try {
        const teamData = await makeWebhookRequest("team", {
            __type: "team",
            query_name: "get",
            id: teamIdToStr(id),
        });
        const team = dbToCacheTeam(teamData);

        if (team) {
            updateTeamCache(team);
            const teams = await getTeams([team.id]);
            return teams[0] ?? null;
        } else console.error("Bad SQL return:", teamData);
    } catch (err) {
        console.error("failed to rerequest teams", err);
    }
    return null;
};

type CheckTeamnameAvailableParams = {
    name: string;
}
const checkTeamnameAvailable = async ({ name }: CheckTeamnameAvailableParams): Promise<boolean> => {
    try {
        return makeWebhookRequest("availability", {
            __type: "team",
            query_name: "available",
            name,
        });
    } catch (err) {
        console.error("failed to check teamname availability", err);
        return false;
    }
};

type AddNewTeamParams = {
    name: string;
    eligible: boolean;
    affiliation: string | null;
    password: string;
    initialUser: UserId;
};

const addNewTeam = async ({ name, eligible, affiliation, password, initialUser }: AddNewTeamParams): Promise<CachedTeamMeta | null> => {
    try {
        apiLogger.trace`Creating new team under name ${name}`;

        const newTeam = await makeWebhookRequest("team", {
            __type: "team",
            query_name: "create",
            name, description: "",
            eligible, affiliation, password,
            initialUser: userIdToStr(initialUser),
        });
        const team = dbToCacheTeam(newTeam);

        if (team) {
            updateTeamCache(team);
            await syncUser({ id: initialUser });
            const teams = await getTeams([team.id]);
            return teams[0] ?? null;
        } else console.error("Bad SQL return:", newTeam);
    } catch (err) {
        console.error("failed to rerequest teams", err);
    }
    return null;
};

type UpdateTeamParams = {
    id: TeamId;
    password: string;

    eligible: boolean;
    affiliation: string | null;

    name: string;
    description: string;
    newPassword: string | null;
};
const updateTeam = async ({
    id, newPassword,
    eligible, affiliation,
    name, description, password,
}: UpdateTeamParams): Promise<CachedTeamMeta | null> => {
    // try {
    //     const updatedTeam = await makeWebhookRequest<DbTeamMeta>({
    //         __type: "team",
    //         query_name: "update",

    //         id: teamIdToStr(id), password,
    //         name, eligible, affiliation, description,
    //         newPassword,
    //     });
    //     const team = dbToCacheTeam(updatedTeam);

    //     if (team) {
    //         updateTeamCache(team);
    //         const teams = await getTeams([team.id]);
    //         return teams[0] ?? null;
    //     } else console.error("Bad SQL return:", updatedTeam);
    // } catch (err) {
    //     console.error("failed to rerequest teams", err);
    // }
    return null;
};


export {
    syncAllTeams, syncTeam,
    checkTeamnameAvailable,
    addNewTeam, updateTeam,
}
