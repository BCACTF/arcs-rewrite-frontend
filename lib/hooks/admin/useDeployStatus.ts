import { ChallId } from "cache/ids";

import useInterval from "../useInterval";
import { useCallback, useEffect, useState } from "react";
import { DeploymentStatus as WebhookDeploymentStatus, FromDeploy } from "database/types/outgoing.schema";

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

const pollDeploy = async (id: ChallId): Promise<DeployStatus> => {
    try {
        const response = await fetch(`/api/admin/deploy-poll?id=${id}`);
        const json = await response.json();
        if (!response.ok) return { id, status: "error", error: `Polling error: ${json}` };
        const status: WebhookDeploymentStatus = json;

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


        const statusTime = status.status_time.secs + status.status_time.nanos / 1e9;
        const EXPECTED_TIME_SECS = 500;
        const POWER = 2;
        const divisor = (EXPECTED_TIME_SECS / 2) ** POWER;
        const exponent = statusTime ** POWER;
        const frac = exponent / divisor;

        const amount = (step + frac / (1 + frac)) / 4;


        const result: DeployStatus = (() => {
            switch (status.status) {
                case "started":
                    return {
                        id,
                        status: "working",
                        amount: 0,
                    };

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

const useDeployStatus = (id: ChallId): [DeployStatus, () => void] => {
    const [deployStatus, setDeployStatus] = useState<DeployStatus>({ id, status: "loading" });

    const interval = deployStatus.status === "working" ? 2000 : 20000;

    useEffect(() => { pollDeploy(id).then(setDeployStatus) }, [id]);
    useInterval(async () => setDeployStatus(await pollDeploy(id)), interval);

    const immediatePoll = useCallback(async () => setDeployStatus(await pollDeploy(id)), [id]);

    return [deployStatus, immediatePoll];
};

export default useDeployStatus;
