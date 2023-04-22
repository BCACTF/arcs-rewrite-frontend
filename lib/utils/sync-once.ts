import { syncAllChalls } from "database/challs";
import { syncSolves } from "database/solves";
import { syncAllTeams } from "database/teams";
import { syncAllUsers } from "database/users";

(async () => {
    await Promise.all([
        syncAllChalls(),
        syncAllTeams(),
        syncAllUsers(),
        syncSolves(),
    ]);
    console.log("Cache synced!");
    process.exit(0);
})();