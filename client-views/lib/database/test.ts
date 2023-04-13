import { addNewUser, requestAllUsers, updateUserFromDbByName } from "./users";
import { addNewTeam, requestAllTeams } from "./teams";
import { userIdFromStr } from "cache/ids";

const users = false;
const teams = true;
const chals = false;

(async () => {
    if (users) {
        // console.log("adding skysky");
        // await addNewUser({ email: "ricecrispieismyname@gmail.com", name: "skyskycally", hashedPassword: "" })
        console.log("updating skysky");
        await updateUserFromDbByName({ name: "skyskycally" });
        // console.log("updating zsovon");
        // await addNewUser({ email: "zsovon24@bergen.org", name: "zsofia", hashedPassword: "" });
        console.log("getting all");
        console.log(await requestAllUsers());
    }

    if (teams) {
        console.log("updating team solid");
        await addNewTeam({
            name: "solid",
            description: "idk what I'm doing man",
            eligible: false,
            affiliation: null,
            hashedPassword: "",
            initialUser: userIdFromStr("9c77c80e-16cc-49f1-9c78-6ef10f5ac5cc")!,
        });
        console.log("getting all");
        console.log(await requestAllTeams());
    }

})();