import { checkUsernameAvailable } from "database/users";
import { NextApiHandler } from "next";
import getUsernameIssue from "utils/username";


const handler: NextApiHandler = async (req, res) =>  {
    if (req.method !== "PUT") {
        res.status(400).send("Invalid method, must be 'PUT'");
        return;
    }

    const json = JSON.parse(req.body);
    const rawName = typeof json === "object" ? json.name : undefined;
    const name = typeof rawName === "string" ? rawName : undefined;

    if (!name) {
        res.status(400).send("Invalid body, must be a JSON object with a non-empty `name` string property");
        return;
    }
    if (getUsernameIssue(name)) {
        res.status(400).send("Invalid username");
        return;
    }

    const output = await checkUsernameAvailable({ name });
    res.status(200).send({ output });
};

export default handler;