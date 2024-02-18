import { Auth } from "database/types/incoming.schema";
import { InputAuth } from "database/users";
import { getConfig } from "metadata/server";

const addClientPerms = async (input: InputAuth): Promise<Auth> => {
    if (input.__type === "o_auth") return {
        ...input,
        params: {
            ...input.params,
            oauth_allow_token: (await getConfig()).webhook.clientOauthAllowToken,
        },
    };
    else return input;
};
export default addClientPerms;
