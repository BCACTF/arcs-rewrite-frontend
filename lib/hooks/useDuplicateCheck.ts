import { useCallback, useMemo, useReducer } from "react";


export type VerificationState = "pending" | "success" | "failure";

type CheckState = {
    output: VerificationState;
    value: string;
};

type Action = {
    __type: "update";
    dispatch: (action: Action) => void;
    value: string;
} | {
    __type: "clear";
    id: number;
    value: string;
    dispatch: (action: Action) => void;
} | {
    __type: "recieve";
    id: number;
    success: boolean;
    forValue: string;
};

let currId = 0;
const getId = () => currId++;

const actionIds: Record<Action["__type"], number> = {
    update: -1,
    clear: -1,
    recieve: -1,
};

const checkDuplicates = (value: string) => new Promise<boolean>((res) => setTimeout(() => res(true), 5000));

function reducer(prevState: CheckState, action: Action): CheckState {
    switch (action.__type) {
        case "update": {
            if (prevState.value === action.value) return prevState;
            console.log("u");
            const id = getId();
            actionIds.update = id;

            const { dispatch, value } = action;
            setTimeout(() => {
                dispatch({
                    __type: "clear",
                    id,
                    value,
                    dispatch,
                })
            }, 2500);

            return {
                ...prevState,
                value,
            };
        }

        case "clear": {
            const { id, dispatch, value } = action;

            if (id === actionIds.update && id !== actionIds.clear) {
                actionIds.clear = id;
                console.log("c");

                checkDuplicates(prevState.value).then(result => dispatch({
                    __type: "recieve",
                    success: result,
                    forValue: prevState.value,
                    id,
                }));
            }
            if (prevState.value === value) return {
                ...prevState,
                output: "pending",
            };
            else return prevState;
        }
        
        case "recieve": {
            const id = action.id;

            if (id === actionIds.clear && id !== actionIds.recieve) {
                actionIds.recieve = id;
                console.log("r");

            }
            if (prevState.value === action.forValue) return {
                ...prevState,
                output: action.success ? "success" : "failure",
            };
            else return prevState;
        }
    }
}

type HookReturn = [VerificationState, (v: string) => void];
const useDuplicateCheck = (): HookReturn => {
    const [state, dispatch] = useReducer<typeof reducer>(reducer, { output: "failure", value: "" });

    const update = useCallback(
        (value: string) => dispatch({ __type: "update", value, dispatch }),
        [dispatch],
    );

    const retVal = useMemo<HookReturn>(() => [state.output, update], [state.output, update]);

    return retVal;
};

export default useDuplicateCheck;
