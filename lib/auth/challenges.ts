import { getConfig } from "metadata/server";

export const webhookToken = async () => (await getConfig()).webhook.authToken;

const validateChallUpdateAuth = async (token: string | undefined) => token && token === await webhookToken();

export default validateChallUpdateAuth;
