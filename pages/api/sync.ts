import { NextApiHandler } from "next";
import { timingSafeEqual } from "crypto";
import { webhookToken } from "auth/challenges";
import { syncAllChalls } from "database/challs";
import { syncAllTeams } from "database/teams";
import { syncAllUsers } from "database/users";
import { syncSolves } from "database/solves";

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
    
    const webhookTokenValue = await webhookToken();

    if (reqBearer.length !== webhookTokenValue.length) {
        console.log("Invalid bearer token:", authorizationHeaderRaw);
        res.statusMessage = "Invalid bearer token";
        res.status(401);
        res.end();
        return;
    }
    
    if (!timingSafeEqual(Buffer.from(reqBearer), Buffer.from(webhookTokenValue))) {
        console.log("Incorrect bearer token:", reqBearer);
        res.statusMessage = "Unauthorized";
        res.status(401);
        res.end();
        return;
    }
    
    try {
        await Promise.all([
            syncAllChalls(),
            syncAllTeams(),
            syncAllUsers(),
            syncSolves(),
        ]);
        
        res.statusMessage = "Challenge successfully synced";
        res.status(200);
        res.end();
    } catch (e) {
        res.status(400);
        res.end();
    }
    
};

export default handler;