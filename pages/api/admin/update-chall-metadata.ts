// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import getAccount from "account/validation";
import { apiLogger, wrapApiEndpoint } from "logging";
import { ChallId, challIdFromStr, fmtLogU } from "cache/ids";
import pollDeploy from "admin/poll";
import updateMetadata from "admin/update-meta";
import { syncChall } from "database/challs";


interface PollDeployParams {
    id: ChallId;

    name?: string;
    desc?: string;
    points?: number;
    categories?: string[];
    tags?: string[];
    visible?: boolean;
}

const getParams = (req: NextApiRequest): PollDeployParams | null => {
    try {
        const id = req.query.id;
        const name = req.query.name;
        const desc = req.query.desc;
        const points = req.query.points;
        const rawCategories = req.query.categories;
        const rawTags = req.query.tags;
        const rawVisible = req.query.visible;

        const categories = typeof rawCategories === "string" ? [rawCategories] : rawCategories;
        const tags = typeof rawTags === "string" ? [rawTags] : rawTags;

        if (typeof id !== "string") return null;
        if (typeof name !== "string" && name !== undefined) return null;
        if (typeof desc !== "string" && desc !== undefined) return null;
        if (typeof points !== "number" && points !== undefined) return null;
        if (rawVisible !== "true" && rawVisible !== "false" && rawVisible !== undefined) return null;
        const visible = rawVisible === "true";

        const challId = challIdFromStr(id);
        if (!challId) return null;

        return {
            id: challId,
            name,
            desc,
            points,
            categories,
            tags,
            visible,
        };
    } catch (e) {
        console.error(e);
        return null;
    }
};

const handler: NextApiHandler = wrapApiEndpoint(async (req, res) =>  {
    apiLogger.trace`Recieved ${req.method} request at ${req.url}`;

    if (req.method !== "PUT") {
        apiLogger.info`Requested with ${req.method} instead of PUT`;
        res.status(400).send("Invalid HTTP method");
        return;
    }

    const account = await getAccount({ req });

    if (!account) {
        apiLogger.secWarn`Admin requests require admin privileges`;
        res.status(401).send("You must be signed in");
        return;
    }

    const userIdLog = fmtLogU(account.userId);

    apiLogger.debug`Request identified as from user ${account.clientSideMetadata.name} (${userIdLog})`;
    if (!account.admin) {
        apiLogger.secWarn`Admin requests require admin privileges`;
        res.status(403).send("You are not an admin");
        return;
    }


    const queryParams = getParams(req);
    if (!queryParams) {
        apiLogger.warn`Badly formatted query: ${JSON.stringify(req.query)}`;
        res.status(400).send("Incorrect query format");
        return
    }

    const { id, name, desc, points, categories, tags, visible } = queryParams;

    const status = await updateMetadata(id, { name, desc, points, categories, tags, visible });

    apiLogger.info`${status ? 'Succeeded' : 'Failed'} in polling deploy server`;

    await syncChall({ id });

    if (status) res.status(200).json(status);
    else res.status(403).send("Failed to poll server");
});

export default handler;
