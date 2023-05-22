import { getConfig } from "metadata/server";
import WebhookDbQuery from "./queries";

const makeWebhookDbRequest = async <T>(query: WebhookDbQuery): Promise<T> => {
    const { webhook: { url: webhookUrl }, frontendAuthToken } = await getConfig();

    const init: RequestInit = {
        method: "POST",
        headers: {
            "authorization": `Bearer ${frontendAuthToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _type: "sqlquery",
            targets: { sql: query },
        }),
    };
    const fetchReturn = await fetch(webhookUrl, init);
    const jsonVal = await fetchReturn.json();
    if (fetchReturn.ok) return jsonVal.sql;
    else throw jsonVal.sql
};

export default makeWebhookDbRequest;
