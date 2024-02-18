import { useCallback, useEffect, useState } from "react";
import useInterval from "../useInterval";

const getUndeployed = async (): Promise<string[]> => {
    try {
        const response = await fetch(`/api/admin/undeployed-challs`);
        const json: string[] = await response.json();
        if (!response.ok) return [];

        return json;
    } catch (e) {
        return [];
    }
};

const useUndeployedChallenges = (): [string[], () => void] => {
    const [undeployedChallenges, setUndeployedChallenges] = useState<string[]>([]);

    const interval = 30000;

    useEffect(() => { getUndeployed().then(setUndeployedChallenges) }, []);
    useInterval(async () => setUndeployedChallenges(await getUndeployed()), interval);

    const immediatePoll = useCallback(async () => setUndeployedChallenges(await getUndeployed()), []);

    return [undeployedChallenges, immediatePoll];
};

export default useUndeployedChallenges;
