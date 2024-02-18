// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import getAccount from "account/validation";
import { apiLogger, wrapApiEndpoint } from "logging";
import { fmtLogU } from "cache/ids";
import initiateDeployment from "admin/init-deploy";


interface InitiateDeployParams {
    name: string;
}

const getBodyJSON = (req: NextApiRequest): unknown => {
    try {
        return JSON.parse(req.body);
    } catch (e) {
        console.error(e);
        return null;
    }
};

const getBody = (body: unknown): InitiateDeployParams | null => {
    try {
        if (typeof body !== "object" || body === null) return null;
        const name = (body as Record<string, unknown>).name;
        if (typeof name !== "string") return null;

        return { name };
    } catch (e) {
        console.error(e);
        return null;
    }
};

const handler: NextApiHandler = wrapApiEndpoint(async (req, res) =>  {
    apiLogger.trace`Recieved ${req.method} request at ${req.url}`;

    if (req.method !== "POST") {
        apiLogger.info`Requested with ${req.method} instead of GET`;
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

    const body = getBodyJSON(req);

    const params = getBody(body);
    if (!params) {
        apiLogger.warn`Badly formatted query: ${body}`;
        res.status(400).send("Incorrect query format");
        return
    }

    const { name } = params;

    try {
        const status = await initiateDeployment(name);
        apiLogger.info`Succeeded in initiating deployment of ${name} on the deploy server`;
        res.status(200).json(status);
    } catch (e) {
        apiLogger.info`Failed in initiating deployment of ${name}`;
        res.status(500).send("Failed to poll server");
    }
});

export default handler;
