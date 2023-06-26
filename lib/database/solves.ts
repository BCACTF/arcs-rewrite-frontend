import makeWebhookRequest from "./makeWebhookReq";
import { ChallId, TeamId, UserId, challIdToStr, teamIdToStr, userIdToStr } from "cache/ids";
import { addSolve } from "cache/solves";
import { DbSolveMeta, dbToCacheSolve } from "./db-types";
import { syncUser } from "./users";
import { syncTeam } from "./teams";
import { syncChall } from "./challs";

const syncSolves = async (): Promise<void> => {
    // try {
    //     const allSolves = await makeWebhookRequest<DbSolveMeta[]>({
    //         __type: "solve",
    //         query_name: "get_all",
    //     });

    //     const solves = allSolves.map(dbToCacheSolve).flatMap(c => c ? [c] : []);
    //     await Promise.all(solves.map(addSolve));

    //     // return await getSolves();
    // } catch (err) {
    //     console.error("failed to rerequest challenges", err);
    // }
};


type SolvedReturn = "failed" | "success" | "correct_no_points";

type AddNewUserReq = (params: {
    challId: ChallId;
    teamId: TeamId;
    userId: UserId;
    flag: string;
}) => Promise<SolvedReturn>;

const attemptSolve: AddNewUserReq = async ({ challId, teamId, userId, flag }): Promise<SolvedReturn> => {
    // try {
    //     const solveRes = await makeWebhookRequest<DbSolveMeta>({
    //         __type: "solve",
    //         query_name: "submit",
    //         user_id: userIdToStr(userId),
    //         challenge_id: challIdToStr(challId),
    //         team_id: teamIdToStr(teamId),
    //         flag,
    //     });
    //     if (!solveRes.correct) return "failed";
    //     if (!solveRes.counted) return "correct_no_points";

    //     const solve = dbToCacheSolve(solveRes);

    //     if (solve) {
    //         await addSolve(solve);
    //         await Promise.all([
    //             syncUser({ id: userId }),
    //             syncTeam({ id: teamId }),
    //             syncChall({ id: challId }),
    //         ])
    //         return "success";
    //     } else console.error("Bad SQL return:", solveRes);
    // } catch (err) {
    //     console.error("failed to submit solve", err);
    // }
    return "failed";
};


export {
    syncSolves,
    attemptSolve,
};
