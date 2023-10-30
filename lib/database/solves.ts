import makeWebhookRequest from "./makeWebhookReq";
import { ChallId, TeamId, UserId, challIdToStr, teamIdToStr, userIdToStr } from "cache/ids";
import { addSolve, clearAllSolves } from "cache/solves";
import { dbToCacheSolve } from "./db-types";
import { InputAuth, syncUser } from "./users";
import { syncTeam } from "./teams";
import { syncChall } from "./challs";
import { apiLogger } from "logging";
import addClientPerms from "auth/webhookClientAuthPerms";
import { Solve } from "./types/outgoing.schema";

const decacheAndSyncSolves = async (): Promise<void> => {
    for (let i = 0; i < 10; i++) {
        try {
            const allSolves = await makeWebhookRequest("solve_arr", {
                __type: "solve",
                details: { __query_name: "get_all" },
            }) as Solve[];
            
            const solves = allSolves.map(dbToCacheSolve).flatMap(c => c ? [c] : []);
            apiLogger.debug`${{ allSolves, solves }}`;

            
            await clearAllSolves();
            await Promise.all(solves.map(addSolve));
    
            apiLogger.info`Successfully recached solves`;
            return;
        } catch (err) {
            apiLogger.error`failed to rerequest challenges: ${err}`;
        }
    }
};

const syncSolves = async (): Promise<void> => {
    try {
        const allSolves = await makeWebhookRequest("solve_arr", {
            __type: "solve",
            details: { __query_name: "get_all" },
        }) as Solve[];

        const solves = allSolves.map(dbToCacheSolve).flatMap(c => c ? [c] : []);
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
    auth: InputAuth;
}) => Promise<SolvedReturn>;

const attemptSolve: AddNewUserReq = async ({ challId, teamId, userId, flag, auth }): Promise<SolvedReturn> => {
    try {
        const solveRes = await makeWebhookRequest("solve", {
            __type: "solve",
            details: {
                __query_name: "attempt",
                params: {
                    user_id: userIdToStr(userId),
                    chall_id: challIdToStr(challId),
                    team_id: teamIdToStr(teamId),
                    flag_guess: flag,
                    user_auth: await addClientPerms(auth),
                }
            }
        }) as Solve;
        
        apiLogger.debug`Solve result: ${solveRes}`;
        if (!solveRes.correct) return "failed";
        if (!solveRes.counted) return "correct_no_points";

        const solve = dbToCacheSolve(solveRes);

        if (solve) {
            await addSolve(solve);
            await Promise.all([
                syncUser({ id: userId }),
                syncTeam({ id: teamId }),
                syncChall({ id: challId }),
            ])
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
    decacheAndSyncSolves
};
