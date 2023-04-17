import { syncAllTeams } from "database/teams";
import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) =>  {
    console.log(await syncAllTeams());
    res.send("bloop");
};

export default handler;