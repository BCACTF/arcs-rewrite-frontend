import { requestAllUsers } from "database/users";
import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) =>  {
    console.log(await requestAllUsers());
    res.send("bloop");
};

export default handler;