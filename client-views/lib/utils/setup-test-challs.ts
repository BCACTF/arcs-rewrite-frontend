import { update } from "cache/challs";
import { readFile } from "fs/promises";

(async () => {
    const contents = await readFile('test-challs.json', 'utf-8');
    const challs = JSON.parse(contents);

    for (const chall of challs) {
        await update(chall);
        console.log(chall);
    }
})();
console.log("started");
