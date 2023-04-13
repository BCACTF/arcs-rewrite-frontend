import WebhookDbQuery from "./queries";

const makeWebhookDbRequest = async (query: WebhookDbQuery) => {
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
    const text = await fetchReturn.text();
    console.log("text:", text);
    return JSON.parse(text).sql.output;
};

export default makeWebhookDbRequest;
