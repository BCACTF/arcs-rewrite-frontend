import validateChallUpdateAuth from "auth/challenges";
import { updateChallenges } from "challenges";
import { User } from "database/models";
import { NextApiHandler } from "next";

let intervalHandle = setInterval(() => updateChallenges(), 30000);

const handler: NextApiHandler = async (req, res) =>  {
    const requestMethod = req.method;
    console.log("REQUEST RECIEVED");
    if (requestMethod === 'PUT') {
        const {
            name,
            email,
        } = req.body;
        try {

            const newUser = await User.create({
                name,
                email,
                score: 0,
                type: "default",
                hashedPassword: "",
            });

            res.status(200).send(await User.findAll({ where: {} }));
        } catch (e) {
            console.log(e);
            res.status(500).send({ reason: "SQL", error: e });
        }
    } else {
        res.status(405).send("405 - Method Not Allowed");
    }
    console.log("REQUEST FINISHED");
};

export default handler;