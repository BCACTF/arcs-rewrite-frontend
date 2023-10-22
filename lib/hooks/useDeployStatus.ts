import { ChallId } from "cache/ids";

import useInterval from "./useInterval";
import { useEffect, useState } from "react";
import { set } from "monocle-ts/lib/Traversal";

export type DeployStatus = {
    id: ChallId;
    status: "loading";
} | {
    id: ChallId;
    status: "idle";
} | {
    id: ChallId;
    status: "error";
    error: string;
} | {
    id: ChallId;
    status: "working";
    amount: number;
};

interface RawResponse {
    status: "building" | "pulling" | "pushing" | "uploading" | "success" | "failure" | "unknown";
    status_time: number;
    chall_name?: string;
    poll_id: string;
}

const pollDeploy = async (id: ChallId): Promise<DeployStatus> => {
    try {
        const response = await fetch(`/api/admin/deploy-poll?id=${id}`);
        const json = await response.json();
        if (!response.ok) return { id, status: "error", error: `Polling error: ${json}` };
        const status: RawResponse = json.deploy;


        const step = (() => {
            switch (status.status) {
                case "building":
                    return 0;
                case "pulling":
                    return 1;
                case "pushing":
                    return 2;
                case "uploading":
                    return 3;
                default:
                    return -1;
            }
        })();


        const EXPECTED_TIME_SECS = 500;
        const POWER = 2;
        const divisor = (EXPECTED_TIME_SECS / 2) ** POWER;
        const exponent = status.status_time ** POWER;
        const frac = exponent / divisor;

        const amount = (step + frac / (1 + frac)) / 4;


        const result: DeployStatus = (() => {
            switch (status.status) {
                case "building":
                case "pulling":
                case "pushing":
                case "uploading":
                    return {
                        id,
                        status: "working",
                        amount,
                    };

                case "success":
                    return {
                        id,
                        status: "idle",
                    };

                case "failure":
                    return {
                        id,
                        status: "error",
                        error: `Deploy error: Check logs`,
                    };

                case "unknown":
                    return {
                        id,
                        status: "idle",
                    };
            }
        })();

        return result;
    } catch (e) {
        return { id, status: "error", error: `Polling error: ${String(e)}` };
    }
};

const useDeployStatus = (id: ChallId) => {
    const [deployStatus, setDeployStatus] = useState<DeployStatus>({ id, status: "loading" });

    // useEffect(() => { pollDeploy(id).then(setDeployStatus) }, [id]);
    useInterval(async () => setDeployStatus(await pollDeploy(id)), 10000);

    return deployStatus;
};

export default useDeployStatus;
