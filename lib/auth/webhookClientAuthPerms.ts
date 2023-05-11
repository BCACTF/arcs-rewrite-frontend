import { Auth } from "database/queries/users";
import { InputAuth } from "database/users";

const addClientPerms = (input: InputAuth): Auth => {
    if (input.__type === "oauth") return {
        ...input,
        trustedClientAuth: process.env.CLIENT_OAUTH_ALLOW_TOKEN ?? "",
    };
    else return input;
};
export default addClientPerms;
