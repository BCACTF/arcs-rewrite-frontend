import makeWebhookRequest from "./makeWebhookReq";
import { CachedTeamMeta, getAllTeams, getTeams, removeStale as removeStaleTeams, update as updateTeamCache } from "cache/teams";
import { TeamId, UserId, teamIdToStr, userIdToStr } from "cache/ids";
import { DbTeamMeta, dbToCacheTeam } from "./db-types";

const syncAllTeams = async (): Promise<CachedTeamMeta[] | null> => {
    try {
        const allTeams = await makeWebhookRequest<DbTeamMeta[]>({
            section: "team",
            query: { __tag: "get_all" },
        });
        if (!allTeams.sql.success) throw allTeams.sql.error;

        const teams = allTeams.sql.output.map(dbToCacheTeam).flatMap(c => c ? [c] : []);
        const usedIds = teams.map(t => t.id);
        removeStaleTeams(usedIds);

        await Promise.all(teams.map(updateTeamCache));

        return await getAllTeams();
    } catch (err) {
        console.error("failed to rerequest teams", err);
    }
    return null;
};

const syncTeam = async ({ id }: { id: TeamId }): Promise<CachedTeamMeta | null> => {
    try {
        const teamRes = await makeWebhookRequest<DbTeamMeta>({
            section: "team",
            query: { __tag: "get", id: teamIdToStr(id) },
        });
        if (!teamRes.sql.success) throw teamRes.sql.error;
        const team = dbToCacheTeam(teamRes.sql.output);

        if (team) {
            updateTeamCache(team);
            const teams = await getTeams([team.id]);
            return teams[0] ?? null;
        } else console.error("Bad SQL return:", teamRes);
    } catch (err) {
        console.error("failed to rerequest teams", err);
    }
    return null;
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
        const newTeam = await makeWebhookRequest<DbTeamMeta>({
            section: "team",
            query: {
                __tag: "create",
                name, eligible, affiliation, password,
                initialUser: userIdToStr(initialUser),
            },
        });
        if (!newTeam.sql.success) throw newTeam.sql.error;
        const team = dbToCacheTeam(newTeam.sql.output);

        if (team) {
            updateTeamCache(team);
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
    try {
        const updatedTeam = await makeWebhookRequest<DbTeamMeta>({
            section: "team",
            query: {
                __tag: "update",
                id: teamIdToStr(id), password,
                name, eligible, affiliation, description,
                newPassword,
            },
        });
        if (!updatedTeam.sql.success) throw updatedTeam.sql.error;
        const team = dbToCacheTeam(updatedTeam.sql.output);

        if (team) {
            updateTeamCache(team);
            const teams = await getTeams([team.id]);
            return teams[0] ?? null;
        } else console.error("Bad SQL return:", updatedTeam);
    } catch (err) {
        console.error("failed to rerequest teams", err);
    }
    return null;
};


export {
    syncAllTeams, syncTeam,
    addNewTeam, updateTeam,
}
