import { NextApiHandler } from "next";

import { checkUsernameAvailable } from "database/users";
import getUsernameIssue from "utils/username";

import { apiLogger, wrapApiEndpoint } from "logging";


const handler: NextApiHandler = wrapApiEndpoint(async (req, res) =>  {
    apiLogger.trace`Recieved ${req.method} request to ${req.url}`;

    if (req.method !== "PUT") {
        apiLogger.info`Invalid request method`;
        res.status(400).send("Invalid method, must be 'PUT'");
        return;
    }

    let json: unknown;
    try {
        json = JSON.parse(req.body);
    } catch (e) {
        apiLogger.info`Non-JSON body: ${req.body}`;
        res.status(400).send("Malformed body");
        return;
    }

    if (typeof json !== "object" || Array.isArray(json) || json === null) {
        apiLogger.info`JSON body was not an object: ${json}`;
        res.status(400).send("Malformed body");
        return;
    }

    const rawName = (json as Record<string, unknown>).name;
    const name = typeof rawName === "string" ? rawName : undefined;

    
    if (!name) {
        apiLogger.info`\`json.name\` does not exist or is of the wrong type.`;
        res.status(400).send("Invalid body, must be a JSON object with a non-empty `name` string property");
        return;
    }

    apiLogger.trace`Checking for availability of username ${name}.`;

    if (getUsernameIssue(name)) {
        apiLogger.info`Username did not match valid username pattern: ${name}`;
        res.status(400).send("Invalid username");
        return;
    }

    const output = await checkUsernameAvailable({ name });

    if (output) apiLogger.debug`Username ${name} was available`;
    else apiLogger.debug`Username ${name} was NOT available`;

    res.status(200).send({ output });
    apiLogger.debug`Response successfully sent`;
});

export default handler;