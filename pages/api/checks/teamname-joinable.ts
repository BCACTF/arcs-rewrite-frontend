import { NextApiHandler } from "next";

import getTeamnameIssue from "utils/teamname";

import { apiLogger, wrapApiEndpoint } from "logging";
import { getAllTeams } from "cache/teams";
import { getUsersByTeam } from "cache/users";
import getCompetition from "metadata/client";


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

    apiLogger.trace`Checking for existence of teamname ${name}.`;

    if (getTeamnameIssue(name)) {
        apiLogger.info`Teamname did not match valid teamname pattern: ${name}`;
        res.status(400).send("Invalid teamname");
        return;
    }

    const matchingTeam = (await getAllTeams()).find(team => team.name === name);

    if (!matchingTeam) {
        apiLogger.info`Team ${name} didn't exist`;
        res.status(404).send({ exists: false, full: false, });
        return;
    }

    const users = (await getUsersByTeam(matchingTeam.id)).length;

    if (users >= (await getCompetition()).maxTeamSize) {
        apiLogger.debug`Team ${name} already full.`;
        res.status(409).send({ exists: true, full: true })
    } else {
        apiLogger.debug`Teamname ${name} was joinable`;
        res.status(200).send({ exists: true, full: false })
    }
    apiLogger.debug`Response successfully sent`;
});

export default handler;