import { syncAllChalls } from "database/challs";
import { syncAllTeams } from "database/teams";
import { syncAllUsers } from "database/users";

(async () => {
    Promise.all([
        syncAllChalls(),
        syncAllTeams(),
        syncAllUsers(),
    ]);
    console.log("Cache synced!");
})();