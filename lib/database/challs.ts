import { removeStale as removeStaleChalls, update as updateChall } from "cache/challs";
import makeWebhookRequest from "./makeWebhookReq";
import { ChallId, challIdToStr } from "cache/ids";
import { DbChallengeMeta, dbToCacheChall } from "./db-types";
import { apiLogger } from "logging";



const syncAllChalls = async () => {
    try {
        const allChalls = await makeWebhookRequest("chall_arr", {
            __type: "chall",
            query_name: "get_all",
        });
        const challs = allChalls.map(dbToCacheChall).flatMap(c => c ? [c] : []);
        const usedIds = challs.map(c => c.id);
        await removeStaleChalls(usedIds);
        await Promise.all(challs.map(c => updateChall(c)));

        apiLogger.info`Successfully recached challs`;
        return challs;    
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }

    return null;
};
const syncChall = async ({ id }: { id: ChallId }) => {
    try {
        apiLogger.trace`Runnning syncChall on chall ${id}.`;

        const challData = await makeWebhookRequest("chall", {
            __type: "chall",
            query_name: "get",
            id: challIdToStr(id),
        });

        apiLogger.trace`Challenge identified as ${challData.name}.`;

        const chall = dbToCacheChall(challData);

        apiLogger.debug`Cache challenge: ${chall}.`;

        if (!chall) {
            apiLogger.error`Webhook returned a badly formatted challenge ${challData}.`;
            return null;
        }

        apiLogger.trace`Adding challenge to redis cache...`;
        
        const cachedChallenge = await updateChall(chall);
        if (cachedChallenge) apiLogger.warn`Replaced chall ${cachedChallenge}`;
        
        apiLogger.info`${challData.name} sync successful.`;

        return chall;
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }

    return null;
};

export {
    syncAllChalls,
    syncChall,
};
