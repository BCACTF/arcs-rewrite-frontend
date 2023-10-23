import { ChallId } from "cache/ids";
import { getConfig } from "metadata/server";

// Started,
//     Building,
//     Pulling,
//     Pushing,
//     Uploading,
//     Success,

//     Failure,

//     Unknown,

interface Response {
    status: "building" | "pulling" | "pushing" | "uploading" | "success" | "failure" | "unknown";
    status_time: number;
    chall_name?: string;
    poll_id: string;
}




const pollDeploy = async (id: ChallId): Promise<Response> => {
    const { webhook: { url: webhookUrl }, frontendAuthToken } = await getConfig();
    const init: RequestInit = {
        method: "POST",
        headers: {
            "authorization": `Bearer ${frontendAuthToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            deploy: {
                __type: "poll",
                id,
            }
        }),
    };

    const fetchReturn = await fetch(webhookUrl, init);
    const returnVal = await fetchReturn.text();
    const jsonVal = (() => {
        try {
            return JSON.parse(returnVal)
        } catch (e) {
            throw returnVal;
        }
    })();
    
    if (!fetchReturn.ok) throw jsonVal;

    return jsonVal;
};

export default pollDeploy;