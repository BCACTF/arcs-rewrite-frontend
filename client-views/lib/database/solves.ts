import makeWebhookRequest from "./makeWebhookReq";
import { update as updateUser, parseUser, removeStale as removeStaleUsers } from "cache/users";
import { ChallId, TeamId, UserId, challIdToStr, teamIdToStr, userIdToStr } from "cache/ids";
import escape, { literal } from "pg-escape";
import { addSolve, parseSolve } from "cache/solves";
import { updateUserFromDb } from "./users";
import { updateTeamFromDb } from "./teams";
import { updateChallFromDb } from "./challs";

const jsonToObj = (json: any) => {
    const {
        user_id: userId,
        challenge_id: challId,
        team_id: teamId,
        inserted_at: time,
    } = json;
    const solveFmt = {
        userId, challId, teamId, time,
    };
    return parseSolve(JSON.stringify(solveFmt));
};

const syncSolves = async () => {
    const query = `
    SELECT
        user_id, challenge_id, team_id, inserted_at
        FROM solve_attempts WHERE correct = true`.split("\n").join(" ");
    
    try {
        const json = await makeWebhookRequest(query);
        console.log(json);
        if (Array.isArray(json)) {
            const allUsers = json.map(jsonToObj).flatMap(c => c ? [c] : []);
            const usedIds = allUsers.map(u => u.userId);
            await removeStaleUsers(usedIds);

            return await Promise.all(allUsers.map(addSolve));
        } else {
            console.error("Bad format:", json);
        }
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }

    return null;
};

type AddNewUserReq = (params: {
    challId: ChallId;
    teamId: TeamId;
    userId: UserId;
    flag: string;
}) => Promise<boolean>;

const attemptSolve: AddNewUserReq = async ({ challId, teamId, userId, flag }) => {

    const correct = await (async () => {
        const checkFlag = `
        SELECT
            COUNT(*) as matches FROM challenges
            WHERE
                id = ${literal(challIdToStr(challId))} AND
                flag = ${literal(flag)}`.split("\n").join(" ");

        const sql = await makeWebhookRequest(checkFlag);
        return parseInt(sql[0]?.matches) >= 1;
    })();

    const alreadySolved = await (async () => {
        const checkAlreadySolved = `
        SELECT
            COUNT(*) as matches FROM solve_attempts
            WHERE
                challenge_id = ${literal(challIdToStr(challId))} AND
                team_id = ${literal(teamIdToStr(teamId))} AND
                correct = true`.split("\n").join(" ");

        const sql = await makeWebhookRequest(checkAlreadySolved);
        return parseInt(sql.matches[0]) >= 1;
    })();

    console.log({ correct, alreadySolved });

    if (!correct || alreadySolved) {
        const query = `
        START TRANSACTION;
            INSERT INTO solve_attempts (
                flag_guess, user_id, challenge_id, team_id,
                correct
            ) VALUES (
                ${literal(flag)},
                ${literal(userIdToStr(userId))},
                ${literal(challIdToStr(challId))},
                ${literal(teamIdToStr(teamId))},
                ${correct}
            );
        COMMIT;`.split("\n").join(" ");

        await makeWebhookRequest(query);
    } else {
        const query = `
        START TRANSACTION;
            INSERT INTO solve_attempts (
                flag_guess, user_id, challenge_id, team_id,
                correct
            ) VALUES (
                ${literal(flag)},
                ${literal(userIdToStr(userId))},
                ${literal(challIdToStr(challId))},
                ${literal(teamIdToStr(teamId))},
                ${true}
            );
            UPDATE users 
            SET last_solve = CURRENT_TIMESTAMP,
                score = score + MAX(SELECT points FROM challenges WHERE id = ${literal(challIdToStr(challId))});
            
            UPDATE teams 
            SET last_solve = CURRENT_TIMESTAMP,
                score = score + MAX(SELECT points FROM challenges WHERE id = ${literal(challIdToStr(challId))});
            
            UPDATE challs 
            SET solve_count = solve_count + 1;
        COMMIT;`.split("\n").join(" ");

        await makeWebhookRequest(query);
    }
    

    await Promise.all([
        updateTeamFromDb({ id: teamId }),
        updateUserFromDb({ id: userId }),
        updateChallFromDb({ id: challId }),
        syncSolves(),
    ]);
    console.log({ correct, flag, alreadySolved });
    return correct;
};


export {
    syncSolves,
    attemptSolve,
};
