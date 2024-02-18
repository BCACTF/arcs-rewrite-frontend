import { ToDeploy } from "database/types/incoming.schema";
import { Outgoing } from "database/types/outgoing.schema";
import { getConfig } from "metadata/server";

const getAllChallsInRepository = async (): Promise<string[]> => {
    const { webhook: { url: webhookUrl }, frontendAuthToken } = await getConfig();

    const body: ToDeploy = { __type: "list_challs" };

    const init: RequestInit = {
        method: "POST",
        headers: {
            "authorization": `Bearer ${frontendAuthToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ deploy: body }),
    };

    const fetchReturn = await fetch(webhookUrl, init);
    const returnVal = await fetchReturn.text();
    const jsonVal: Outgoing = (() => {
        try {
            return JSON.parse(returnVal)
        } catch (e) {
            throw returnVal;
        }
    })();

    if (!fetchReturn.ok) throw jsonVal;
    if (!jsonVal.deploy) throw jsonVal;
    const deploy = jsonVal.deploy;

    if (deploy.ok === "err") throw deploy.data;
    const deployData = deploy.data;

    if (deployData.__type !== "chall_name_list") throw deployData;
    const status = deployData.data;

    return status;
};

export default getAllChallsInRepository;
