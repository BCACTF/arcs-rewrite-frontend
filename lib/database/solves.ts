import makeWebhookRequest from "./makeWebhookReq";
import { ChallId, TeamId, UserId, challIdToStr, teamIdToStr, userIdToStr } from "cache/ids";
import { addSolve } from "cache/solves";
import { DbSolveMeta, dbToCacheSolve } from "./db-types";

const syncSolves = async (): Promise<void> => {
    try {
        const allSolves = await makeWebhookRequest<DbSolveMeta[]>({
            section: "solve",
            query: { __tag: "get_all" },
        });
        if (!allSolves.sql.success) throw allSolves.sql.error;

        const solves = allSolves.sql.output.map(dbToCacheSolve).flatMap(c => c ? [c] : []);
        await Promise.all(solves.map(addSolve));

        // return await getSolves();
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }
};


type SolvedReturn = "failed" | "success" | "correct_no_points";

type AddNewUserReq = (params: {
    challId: ChallId;
    teamId: TeamId;
    userId: UserId;
    flag: string;
}) => Promise<SolvedReturn>;

const attemptSolve: AddNewUserReq = async ({ challId, teamId, userId, flag }): Promise<SolvedReturn> => {
    try {
        const solveRes = await makeWebhookRequest<DbSolveMeta>({
            section: "solve",
            query: {
                __tag: "submit",
                user_id: userIdToStr(userId),
                challenge_id: challIdToStr(challId),
                team_id: teamIdToStr(teamId),
                flag,
            },
        });
        if (!solveRes.sql.success) throw solveRes.sql.error;
        if (!solveRes.sql.output.correct) return "failed";
        if (!solveRes.sql.output.counted) return "correct_no_points";

        const solve = dbToCacheSolve(solveRes.sql.output)

        if (solve) {
            addSolve(solve);
            return "success";
        } else console.error("Bad SQL return:", solveRes);
    } catch (err) {
        console.error("failed to submit solve", err);
    }
    return "failed";
};


export {
    syncSolves,
    attemptSolve,
};
