import { removeStale as removeStaleChalls, update as updateChall } from "cache/challs";
import makeWebhookRequest from "./makeWebhookReq";
import { ChallId, challIdToStr } from "cache/ids";
import { DbChallengeMeta, dbToCacheChall } from "./db-types";



const syncAllChalls = async () => {
    try {
        const allChalls = await makeWebhookRequest<DbChallengeMeta[]>({
            section: "challenge",
            query: { __tag: "get_all" },
        });
        if (!allChalls.sql.success) throw allChalls.sql.error;
        const challs = allChalls.sql.output.map(dbToCacheChall).flatMap(c => c ? [c] : []);
        const usedIds = challs.map(c => c.id);
        await removeStaleChalls(usedIds);
        await Promise.all(challs.map(c => updateChall(c)));
        return challs;
    
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }

    return null;
};
const syncChall = async ({ id }: { id: ChallId }) => {
    try {
        console.log("making webhook request woooo");
        const allChalls = await makeWebhookRequest<DbChallengeMeta>({
            section: "challenge",
            query: { __tag: "get", id: challIdToStr(id), },
        });
        console.log("it made the webhook request")
        if (!allChalls.sql.success) throw allChalls.sql.error;
        console.log("it was successful")
        const chall = dbToCacheChall(allChalls.sql.output);
        console.log("to cache we went");
        if (!chall) {
            console.error("recieved bad challenge from webhook");
            return null;
        }
        console.log("chall seemed good");
        console.log("challenge:", chall);
        await updateChall(chall);
        console.log("we have updated the challenge wooooooo")
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
