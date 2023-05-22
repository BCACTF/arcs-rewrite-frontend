// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import { addUser, checkUsernameAvailable } from "database/users";
import { getTokenSecret } from "api/auth/[...nextauth]";
import getUsernameIssue from "utils/username";


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

const handler: NextApiHandler = async (req, res) =>  {
    if (req.method !== "POST") {
        res.status(400).send("Invalid HTTP method");
    }

    const token = await getTokenSecret({ req });

    console.log("create point 1", token);

    if (!token) {
        res.status(401).send("No oauth token found");
        return;
    }

    const { email, sub, provider } = token;

    console.log({ email, sub, provider });
    if (!email || !sub || typeof provider !== "string") {
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

    await addUser({
        email,
        name: username,
        auth: { __type: "oauth", sub, provider },
        eligible,
    });

    res.status(200).send("Successfully created user");
};

export default handler;