const makeWebhookRequest = async (query: string) => {
    const webhookAddress = process.env.WEBHOOK_SERVER_ADDRESS;
    const frontendAuth = process.env.FRONTEND_SERVER_AUTH_TOKEN;
    if (!webhookAddress) throw new Error("Webhook address not specified");

    console.log({ webhookAddress, frontendAuth });

    const init: RequestInit = {
        method: "POST",
        headers: {
            "authorization": `Bearer ${frontendAuth}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _type: "sqlquery",
            targets: {
                sql: { query },
            },
        }),
    };

    return await fetch(webhookAddress, init);
};

export default makeWebhookRequest;
