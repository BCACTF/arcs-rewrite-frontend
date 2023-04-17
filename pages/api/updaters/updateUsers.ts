import { syncAllUsers } from "database/users";
import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) =>  {
    console.log(await syncAllUsers());
    res.send("bloop");
};

export default handler;