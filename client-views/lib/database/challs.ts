import { parseChallenge, removeStale as removeStaleChalls, update as updateChall } from "cache/challs";
import makeWebhookRequest from "./makeWebhookReq";

const requestAllChalls = async () => {
    const query = `
    SELECT
        id, name, description, points
        authors, hints, categories, tags, links
        solve_count visible FROM challenges`;
    
    try {
        const response = await makeWebhookRequest(query);
        const json = await response.json();
        if (Array.isArray(json)) {
            const newChalls = json.map(parseChallenge).flatMap(c => c ? [c] : []);
            const usedIds = newChalls.map(c => c.challId);
            await removeStaleChalls(usedIds);

            return await Promise.all(newChalls.map(c => updateChall(c)));
        } else {
            console.error("Bad format:", json, "\nResponse: ", response);
        }
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }

    return null;
};

requestAllChalls().then();
