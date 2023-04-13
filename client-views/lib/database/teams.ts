import makeWebhookRequest from "./makeWebhookReq";
import { parseTeam, removeStale as removeStaleTeams, update } from "cache/teams";
import { TeamId, UserId, idValid, newRandomUuid, teamIdFromStr, teamIdToStr, userIdToStr, uuidToStr } from "cache/ids";
import { literal } from "pg-escape";
import { createHash } from "crypto";
import { updateUserFromDb, updateUserFromDbByName } from "./users";

const jsonToObj = (json: any) => {
    const {
        id,
        name,
        score,
        last_solve: lastSolve,
        eligible,
        affiliation,
    } = json;

    const teamFmt = { id, name, score, lastSolve, eligible, affiliation };
    return parseTeam(JSON.stringify(teamFmt));
};


const requestAllTeams = async () => {
    const query = `
    SELECT
        id, name, description, score,
        last_solve, eligible, affiliation
        FROM teams`.split("\n").join(" ");
    
    try {
        const sql = await makeWebhookRequest(query);
        if (Array.isArray(sql)) {
            const newTeams = sql.map(jsonToObj).flatMap(t => t ? [t] : []);
            const usedIds = newTeams.map(t => t.id);
            await removeStaleTeams(usedIds);

            return await Promise.all(newTeams.map(c => update(c)));
        } else {
            console.error("Bad format:", sql);
        }
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }

    return null;
};

type AddNewTeamReq = (params: {
    name: string;
    description: string;
    eligible: boolean;
    affiliation: string | null;
    password: string;
    initialUser: UserId;
}) => Promise<boolean>;

const addNewTeam: AddNewTeamReq = async ({ name, description, eligible, affiliation, password, initialUser }) => {
    const newTeamId = uuidToStr(newRandomUuid());
    const teamIdNewtype = teamIdFromStr(newTeamId);
    if (!teamIdNewtype) return false;

    const query = `
    START TRANSACTION;
        INSERT INTO teams (
            id,
            name, description, eligible, affiliation,
            hashed_password
        ) VALUES (
            ${literal(newTeamId)},
            ${literal(name)},
            ${literal(description)},
            ${eligible},
            ${affiliation ? literal(affiliation) : null},
            ${literal(hashPassword({ password, teamId: teamIdNewtype }))}
        );
        UPDATE users 
        SET team_id = ${literal(newTeamId)}
        WHERE id = ${literal(userIdToStr(initialUser))};
    COMMIT;`.split("\n").join(" ");

    console.log(query.replaceAll(/ +/g, " "));

    try {
        const sql = await makeWebhookRequest(query);
        await updateTeamFromDb({ id: teamIdNewtype });
        await updateUserFromDb({ id: initialUser });
        console.log(sql);
        if (Array.isArray(sql)) {
            const team = jsonToObj(sql[0]);
            if (team) {
                await update(team);
                return true;
            } else {
                console.error("Invalid team:", team);
            }
        } else {
            console.error("Bad format:", sql);
        }
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }

    return false;
};

type UpdateTeamFromDbReq = (params: {
    id: TeamId,
}) => Promise<boolean>;

const updateTeamFromDb: UpdateTeamFromDbReq = async ({ id }) => {
    const query = `
    SELECT
        id, name, description, score,
        last_solve, eligible, affiliation
        FROM teams
        WHERE id = ${literal(teamIdToStr(id))}`.split("\n").join(" ");

    console.log(query.replaceAll(/ +/g, " "));

    try {
        const sql = await makeWebhookRequest(query);
        console.log(sql);
        if (typeof sql.statusCode !== 'number' || sql.statusCode === 200) {
            // await updateUserFromDbByName({ name });
            return true;
        }
        else console.error("Bad format:", sql);
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }

    return false;
};


type JoinTeamReq = (params: {
    teamId: TeamId;
    userId: UserId;
    password: string;
}) => Promise<boolean>;

const joinTeam: JoinTeamReq = async ({ teamId, userId, password }) => {
    const hash = hashPassword({ password, teamId });

    {
        const verifyPasswordHash = `
        SELECT
            COUNT(*) as matches FROM teams
            WHERE teamId = ${literal(teamIdToStr(teamId))} AND hashed_password = ${literal(hash)}`.split("\n").join(" ");

        const sql = await makeWebhookRequest(verifyPasswordHash);
        if (sql.matches !== 1) return false;
    }
    {
        const query = `
        UPDATE users 
            SET team_id = ${literal(teamIdToStr(teamId))}
            WHERE id = ${literal(userIdToStr(userId))};`.split("\n").join(" ");
        
        await makeWebhookRequest(query);

        await Promise.all([
            updateTeamFromDb({ id: teamId }),
            updateUserFromDb({ id: userId })
        ]);
        return true;
    }
};


type HashTeamPassw = (params: {
    password: string;
    teamId: TeamId;
}) => string;

const hashPassword: HashTeamPassw = ({ password, teamId }) => createHash('sha256')
    .update(teamIdToStr(teamId))
    .update(password)
    .digest('hex');

export {
    addNewTeam,
    updateTeamFromDb,
    requestAllTeams,
    hashPassword,
    joinTeam,
}
