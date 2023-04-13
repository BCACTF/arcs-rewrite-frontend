import { addNewUser } from "database/users";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";


const handler: NextApiHandler = async (req, res) =>  {
    const token = await getToken({ req });
    if (!token) return "nl";
    const { email, name } = { email: token?.email, name: JSON.parse(req.body).name };
    console.log({email, name})
    if (email && name) {
        await addNewUser({ email, name, password: "", eligible: true });
    }
    res.send("bloop");
};

export default handler;