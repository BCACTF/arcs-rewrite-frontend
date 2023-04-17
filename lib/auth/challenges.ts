import webhookToken from "./webhook";

const validateChallUpdateAuth = (token: string | undefined) => token && webhookToken && token === webhookToken;

export default validateChallUpdateAuth;
