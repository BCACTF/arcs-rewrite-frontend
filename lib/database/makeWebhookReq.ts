import WebhookDbQuery from "./queries";

type SqlReturnType<T> = {
    success: true,
    output: T,
} | {
    success: false,
    error: {
        type: string,
        code: number,
        data: unknown,
    }
};

type DbReqReturnType<T> = {
    sql: SqlReturnType<T>,
};

const makeWebhookDbRequest = async <T>(query: WebhookDbQuery): Promise<DbReqReturnType<T>> => {
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
    return await fetchReturn.json();
};

export default makeWebhookDbRequest;
