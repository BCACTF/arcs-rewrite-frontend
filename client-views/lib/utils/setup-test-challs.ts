import { update as updateChall } from "cache/challs";
import { update as updateTeam } from "cache/teams";
import { update as updateUser } from "cache/users";
import { readFile } from "fs/promises";

(async () => {
    const challContents = await readFile('test-challs.json', 'utf-8');
    const challs = JSON.parse(challContents);
    for (const chall of challs) {
        await updateChall(chall);
        console.log(chall);
    }

    const teamContents = await readFile('test-teams.json', 'utf-8');
    const teams = JSON.parse(teamContents);
    for (const team of teams) {
        await updateTeam(team);
        console.log(team);
    }

    const userContents = await readFile('test-teams.json', 'utf-8');
    const users = JSON.parse(userContents);
    for (const user of users) {
        await updateUser(user);
        console.log(user);
    }
})();
console.log("started");
