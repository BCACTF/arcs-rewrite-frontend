// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import { addUser, checkUsernameAvailable } from "database/users";
import { getTokenSecret } from "api/auth/[...nextauth]";
import getUsernameIssue from "utils/username";
import { apiLogger, wrapApiEndpoint } from "logging";


interface NewUserApiParams {
    username: string;
    eligible: boolean;
    affiliation: string | null;
}

const getParams = (req: NextApiRequest): NewUserApiParams | null => {
    try {
        const body: unknown = JSON.parse(req.body);
        if (typeof body !== "object" || body === null) return null;
        if (Array.isArray(body) || typeof body === "function") return null;
    
        const { username, eligible, affiliation } = body as Record<string, unknown>;

        if (typeof username !== "string") return null;
        if (typeof eligible !== "boolean") return null;
        if (typeof affiliation !== "string" && affiliation !== null) return null;
        
        if (getUsernameIssue(username) !== null) return null;

        return { username, eligible, affiliation };
    } catch (e) {
        console.error(e);
        return null;
    }
};

const handler: NextApiHandler = wrapApiEndpoint(async (req, res) =>  {
    apiLogger.trace`Recieved ${req.method} request for ${req.url}.`;

    if (req.method !== "POST") {
        res.status(400).send("Invalid HTTP method");
        return;
    }

    const token = await getTokenSecret({ req });

    apiLogger.trace`Got token for ${token?.name}.`;
    
    if (!token) {
        res.status(401).send("No oauth token found");
        apiLogger.secWarn`No oauth token found for create user request`;
        return;
    }

    const { email, sub, provider } = token;

    console.log({ email, sub, provider });
    if (!email || !sub || typeof provider !== "string") {
        apiLogger.warn`Incorrect token format`;
        res.status(400).send("Incorrect token format");
        return
    }

    const bodyParams = getParams(req);
    console.log(bodyParams);

    if (!bodyParams) {
        res.status(400).send("Incorrect body format");
        return
    }

    const { username, eligible, affiliation } = bodyParams;

    apiLogger.debug`User info: ${username} is ${eligible ? "eligible" : "not eligible"} and is affiliated with ${affiliation}`;
    
    if (!await checkUsernameAvailable({ name: username })) {
        apiLogger.info`Username was not available.`;
        res.status(400).send("Username is not available");
        return;
    }

    const returnValue = await addUser({
        email,
        name: username,
        auth: { __type: "oauth", sub, provider },
        eligible,
    });

    apiLogger.debug`addUser returned ${returnValue}`;

    res.status(200).send("Successfully created user");
});

export default handler;