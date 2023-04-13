import { requestAllChalls } from "database/challs";
import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) =>  {
    console.log(await requestAllChalls());
    res.send("bloop");
};

export default handler;