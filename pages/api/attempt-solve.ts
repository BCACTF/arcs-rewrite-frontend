import getAccount from "account/validation";
import { challIdFromStr } from "cache/ids";
import { getTeams } from "cache/teams";
import { syncUser } from "database/users";
import { attemptSolve } from "database/solves";
import { NextApiHandler } from "next";
import getCompetition from "metadata/client";


const handler: NextApiHandler = async (req, res) =>  {
    const { start, end } = await getCompetition();
    const now = Date.now() / 1000;
    if (start > now || now > end) {
        res.status(400).send("Competition not running.");
        return;
    }

    {
        const staleAccount = await getAccount({ req });
        if (!staleAccount) {
            res.status(401).send("Not signed in");
            return;
        }
        await syncUser({ id: staleAccount.userId });
    }
    const account = await getAccount({ req });
    if (!account) {
        res.status(401).send("Not signed in");
        return;
    }
    if (!account.teamId) {
        res.status(403).send("Cannot submit solves without a team!");
        return;
    }
    const team = (await getTeams([ account.teamId ])).find(team => team.id === account.teamId);
    if (!team) {
        res.status(500).send("Can't access team");
        return;
    }

    const json = JSON.parse(req.body);
    if (typeof json !== 'object' || json === null) {
        res.status(400).send("Invalid request body");
        return;
    }
    
    const { flag, challId: challIdRaw } = json;
    if (!flag || !challIdRaw) {
        res.status(400).send("flag and/or challId left undefined");
        return;
    }

    const teamId = team.id;
    const userId = account.userId;
    const challId = challIdFromStr(challIdRaw);
    if (!challId) {
        res.status(400).send("Badly formatted challId");
        return;
    }

    try {
        const returnVal = await attemptSolve({ teamId, userId, challId, flag });
        if (returnVal === "success") {
            res.status(200).send(true);
            return
        } else {
            res.status(200).send(false);
            return;
        }
    } catch (e) {
        res.status(500).send("Internal Server Error!");
        return;
    }
};

export default handler;