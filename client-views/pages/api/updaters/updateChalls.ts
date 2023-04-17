import { syncAllChalls } from "database/challs";
import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) =>  {
    console.log(await syncAllChalls());
    res.send("bloop");
};

export default handler;