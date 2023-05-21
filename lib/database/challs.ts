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
        const challs = allChalls.map(dbToCacheChall).flatMap(c => c ? [c] : []);
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
        const challData = await makeWebhookRequest<DbChallengeMeta>({
            section: "challenge",
            query: { __tag: "get", id: challIdToStr(id), },
        });
        console.log("it made the webhook request")
        console.log("it was successful")
        const chall = dbToCacheChall(challData);
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
