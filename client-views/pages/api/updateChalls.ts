import validateChallUpdateAuth from "auth/challenges";
import { updateChallenges } from "challenges";
import { NextApiHandler } from "next";

let intervalHandle = setInterval(() => updateChallenges(), 30000);

const handler: NextApiHandler = async (req, res) =>  {
    const requestMethod = req.method;
    if (requestMethod === 'PUT') {
        if (validateChallUpdateAuth(req.headers.authorization)) {
            try {
                updateChallenges();
                res.status(200).send("");
            } catch (e) {
                res.status(500).send(e);
                console.error(e);
            }
        } else {
            res.status(403).send("403 - Unauthorized");
        }
    } else {
        res.status(405).send("405 - Method Not Allowed");
    }
  
};

export default handler;