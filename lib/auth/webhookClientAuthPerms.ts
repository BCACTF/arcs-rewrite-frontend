import { Auth } from "database/queries/users";
import { InputAuth } from "database/users";
import { getConfig } from "metadata/server";

const addClientPerms = async (input: InputAuth): Promise<Auth> => {
    if (input.__type === "oauth") return {
        ...input,
        oauth_allow_token: (await getConfig()).webhook.clientOauthAllowToken,
    };
    else return input;
};
export default addClientPerms;
