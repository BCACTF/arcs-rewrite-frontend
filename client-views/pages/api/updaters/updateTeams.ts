import { requestAllTeams } from "database/teams";
import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) =>  {
    console.log(await requestAllTeams());
    res.send("bloop");
};

export default handler;