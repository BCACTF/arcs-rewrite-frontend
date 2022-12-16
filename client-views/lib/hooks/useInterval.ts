import { useEffect } from "react";


const useInterval = (intervalFn: () => void, delay: number) => {
    useEffect(
        () => {
            const intervalHandle = setInterval(intervalFn, delay);
            return () => clearInterval(intervalHandle);
        },
        [intervalFn, delay],
    );
};

export default useInterval;
