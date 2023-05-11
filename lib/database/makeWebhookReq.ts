import WebhookDbQuery from "./queries";

const makeWebhookDbRequest = async <T>(query: WebhookDbQuery): Promise<T> => {
    const webhookAddress = process.env.WEBHOOK_SERVER_ADDRESS;
    const frontendAuth = process.env.FRONTEND_SERVER_AUTH_TOKEN;
    if (!webhookAddress) throw new Error("Webhook address not specified");

    const init: RequestInit = {
        method: "POST",
        headers: {
            "authorization": `Bearer ${frontendAuth}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _type: "sqlquery",
            targets: { sql: query },
        }),
    };
    const fetchReturn = await fetch(webhookAddress, init);
    const jsonVal = await fetchReturn.json();
    if (fetchReturn.ok) return jsonVal.sql;
    else throw jsonVal.sql
};

export default makeWebhookDbRequest;
