import { parseChallenge, removeStale as removeStaleChalls, update as updateChall } from "cache/challs";
import makeWebhookRequest from "./makeWebhookReq";
import { ChallId, challIdToStr, newRandomUuid, uuidToStr } from "cache/ids";
import { literal } from "pg-escape";

const jsonToObj = (json: any) => {
    const {
        id: challId,
        visible,

        name, description: desc, points,
        authors, hints, categories: cats, links, tags,
        solve_count: solveCount
    } = json;

    const userFmt = {
        challId,
        deploymentUuid: challId,
        visible,
        clientSideMetadata: {
            name, points, solveCount, authors, hints, tags, links,
            desc: desc ?? "<no description>",
            id: challId,
            categories: cats.slice(1, -1).split(", "),
        },
    };
    console.log(userFmt);
    return parseChallenge(JSON.stringify(userFmt));
};

const requestAllChalls = async () => {
    // const 
    const query = `
    SELECT
        id, name, description, points,
        authors, hints, categories, tags, links,
        solve_count, visible FROM challenges`.split("\n").join(" ")
    try {
        const sql = await makeWebhookRequest(query);
        if (sql && Array.isArray(sql)) {
            const challs = sql.map(jsonToObj).flatMap(c => c ? [c] : []);
            const usedIds = challs.map(c => c.challId);
            await removeStaleChalls(usedIds);
            await Promise.all(challs.map(c => updateChall(c)));
            return challs;
        } else {
            console.error("Bad format:", sql);
        }
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }

    return null;
};
const updateChallFromDb = async ({ id }: { id: ChallId }) => {
    const query = `
    SELECT
        id, name, description, points,
        authors, hints, categories, tags, links,
        solve_count, visible FROM challenges
    WHERE id = ${literal(challIdToStr(id))}`.split("\n").join(" ");
    
    try {
        const sql = await makeWebhookRequest(query);
        if (sql && Array.isArray(sql)) {
            const chall = sql.map(jsonToObj).flatMap(c => c ? [c] : [])[0];
            await updateChall(chall);
            return chall;
        } else {
            console.error("Bad format:", sql);
        }
    } catch (err) {
        console.error("failed to rerequest challenges", err);
    }

    return null;
};

export {
    requestAllChalls,
    updateChallFromDb,
};
