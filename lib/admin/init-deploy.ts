import { ChallId, challIdToStr } from "cache/ids";
import { ToDeploy } from "database/types/incoming.schema";
import { DeploymentStatus, Outgoing } from "database/types/outgoing.schema";
import { getConfig } from "metadata/server";

const initiateDeployment = async (name: string): Promise<string> => {
    const { webhook: { url: webhookUrl }, frontendAuthToken } = await getConfig();

    const body: ToDeploy = {
        __type: "deploy",
        data: { chall: name, force_wipe: false },
    };

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

    if (deployData.__type !== "status") throw deployData;
    const status = deployData.data;

    return status.poll_id;
};

export default initiateDeployment;
