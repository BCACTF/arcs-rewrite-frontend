let webhookToken : string;
if(typeof process.env.WEBHOOK_SERVER_AUTH_TOKEN !== "undefined" && process.env.WEBHOOK_SERVER_AUTH_TOKEN.length > 0) {
    webhookToken = process.env.WEBHOOK_SERVER_AUTH_TOKEN;
} else {
    console.log("No webhook token! Panic! Run for your lives! The world is ending! (or just give us one and we will fix everything)")
    process.exit(1);
}

export default webhookToken;
