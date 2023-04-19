import { NextApiHandler } from "next";
import { timingSafeEqual } from "crypto";
import webhookToken from "auth/webhook";
import { syncChall } from "database/challs";
import { challIdFromStr } from "cache/ids";

const handler: NextApiHandler = async (req, res) =>  {
    console.log("request recieved");

    const authorizationHeaderRaw = req.headers.authorization;
    if (!authorizationHeaderRaw || !authorizationHeaderRaw.startsWith("Bearer ")) {
        console.log("Invalid bearer token:", authorizationHeaderRaw);
        res.statusMessage = "Invalid bearer token";
        res.status(401);
        res.end();
        return;
    }

    const reqBearer = authorizationHeaderRaw.substring("Bearer ".length);
    
    if (reqBearer.length !== webhookToken.length) {
        console.log("Invalid bearer token:", authorizationHeaderRaw);
        res.statusMessage = "Invalid bearer token";
        res.status(401);
        res.end();
        return;
    }
    
    if (!timingSafeEqual(Buffer.from(reqBearer), Buffer.from(webhookToken))) {
        console.log("Incorrect bearer token:", reqBearer);
        res.statusMessage = "Unauthorized";
        res.status(401);
        res.end();
        return;
    }
    
    try {
        // TODO --> Do something with poll_id once admin panel is done
        const { chall_id, poll_id } = req.body as { chall_id: unknown, poll_id: unknown };
        console.log("trying to sync");
        if (typeof chall_id !== "string") throw "chall_id";
        if (typeof poll_id !== "string") throw "poll_id";
        console.log("trying to sync this challenge even more");
        const id = challIdFromStr(chall_id);
        if (!id) throw "chall_id";

        await syncChall({ id });
        console.log("successfully synced challenge");

        res.statusMessage = "Challenge successfully synced";
        res.status(200);
        res.end();
    } catch (e) {
        console.log("Invalid payload:", req.body);
        res.statusMessage = "Invalid payload";
        res.status(400);
        res.end();
    }
    
};

export default handler;