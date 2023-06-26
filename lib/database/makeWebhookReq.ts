import { getConfig } from "metadata/server";
import WebhookDbQuery from "./queries";
import { DbChallengeMeta, DbTeamMeta, DbUserMeta } from "./db-types";

type ReturnTypes = {
    chall: DbChallengeMeta,
    chall_arr: DbChallengeMeta[],

    team: DbTeamMeta,
    team_arr: DbTeamMeta[],

    user: DbUserMeta,
    user_arr: DbUserMeta[],

    availability: boolean,
    auth_status: boolean,
};

const makeWebhookDbRequest = async <RetType extends keyof ReturnTypes>(type: RetType, query: WebhookDbQuery): Promise<ReturnTypes[RetType]> => {
    const { webhook: { url: webhookUrl }, frontendAuthToken } = await getConfig();
    const init: RequestInit = {
        method: "POST",
        headers: {
            "authorization": `Bearer ${frontendAuthToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sql: query,
        }),
    };
    const fetchReturn = await fetch(webhookUrl, init);
    const returnVal = await fetchReturn.text();
    const jsonVal = (() => {
        try {
            return JSON.parse(returnVal)
        } catch (e) {
            throw returnVal;
        }
    })();
    
    if (!fetchReturn.ok) throw jsonVal.sql;

    const { __type, data } = jsonVal.sql;
    if (__type !== type) throw jsonVal.sql;
    
    return data;
};

export default makeWebhookDbRequest;
