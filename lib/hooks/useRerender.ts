import { useCallback, useState } from "react";


const useRerender = () => {
    const stateCallback = useState(true)[1];
    return useCallback(() => stateCallback(bool => !bool), [stateCallback]);
};

export default useRerender;
