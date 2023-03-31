import { removeStale as removeStaleChalls, update as updateChall } from "cache/challs";
import { removeStale as removeStaleTeams, update as updateTeam } from "cache/teams";
import { removeStale as removeStaleUsers, update as updateUser } from "cache/users";
import { addSolve } from "cache/solves";
import { readFile } from "fs/promises";
import cache from "cache";

(async () => {
    await Promise.all([
        await removeStaleUsers([]),
        await removeStaleTeams([]),
        await removeStaleChalls([]),
    ])

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

    const userContents = await readFile('test-users.json', 'utf-8');
    const users = JSON.parse(userContents);
    for (const user of users) {
        await updateUser(user);
        console.log(user);
    }

    const solveContents = await readFile('test-solves.json', 'utf-8');
    const solves = JSON.parse(solveContents);
    for (const solve of solves) {
        await addSolve(solve);
        console.log(solve);
    }
})();
console.log("started");
