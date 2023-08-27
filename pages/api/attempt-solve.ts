import getAccount from "account/validation";
import { challIdFromStr, fmtLogT } from "cache/ids";
import { getTeams } from "cache/teams";
import { syncUser } from "database/users";
import { attemptSolve } from "database/solves";
import { NextApiHandler } from "next";
import getCompetition from "metadata/client";
import { apiLogger, wrapApiEndpoint } from "logging";


const handler: NextApiHandler = wrapApiEndpoint(async (req, res) =>  {
    apiLogger.trace`${req.method} request recieved for ${req.url}`;

    const { start, end } = await getCompetition();
    const now = Date.now() / 1000;
    if (start > now || now > end) {
        apiLogger.info`Flag submitted outside of challenge time.`;

        res.status(400).send("Competition not running.");
        return;
    }

    {
        const staleAccount = await getAccount({ req });
        if (!staleAccount) {
            apiLogger.secWarn`User not signed in when flag submitted.`;

            res.status(401).send("Not signed in");
            return;
        }
        await syncUser({ id: staleAccount.userId });
    }
    const account = await getAccount({ req });
    if (!account) {
        apiLogger.secWarn`User not signed in when flag submitted.`;

        res.status(401).send("Not signed in");
        return;
    }
    if (!account.teamId) {
        apiLogger.warn`${account.clientSideMetadata.name} was not on a team`;

        res.status(403).send("Cannot submit solves without a team!");
        return;
    }
    const team = (await getTeams([ account.teamId ])).find(team => team.id === account.teamId);
    if (!team) {
        apiLogger.error`Can't access team ${fmtLogT(account.teamId)}!`;

        res.status(500).send("Can't access team");
        return;
    }

    const json = JSON.parse(req.body);
    if (typeof json !== 'object' || json === null) {
        apiLogger.warn`Invalid request body ${req.body}`;

        res.status(400).send("Invalid request body");
        return;
    }
    
    const { flag, challId: challIdRaw } = json;
    if (!flag || !challIdRaw) {
        apiLogger.warn`Bad body: ${{ flag, challId: challIdRaw }}`;

        res.status(400).send("flag and/or challId left undefined");
        return;
    }

    const teamId = team.id;
    const userId = account.userId;
    const challId = challIdFromStr(challIdRaw);
    if (!challId) {
        apiLogger.warn`Bad challenge id: ${String(challIdRaw).slice(0, 10)}`;

        res.status(400).send("Badly formatted challId");
        return;
    }

    try {
        const returnVal = await attemptSolve({
            teamId, userId, challId,
            auth: { __type: "oauth", sub: account.sub, provider: account.provider },
            flag,
        });
        apiLogger.warn`Return value: ${returnVal}`;

        res.status(200).send(returnVal);
        return;
    } catch (e) {
        apiLogger.warn`Internal server error: ${e}`;
        res.status(500).send("Internal Server Error!");

        return;
    }
});

export default handler;
