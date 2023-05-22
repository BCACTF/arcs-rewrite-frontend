import { useCallback, useMemo, useReducer } from "react";
import getUsernameIssue, { UsernameIssue } from "utils/username";


export type VerificationState = "pending" | "success" | "stalesuccess" | "failure";

type CheckState = {
    output: VerificationState;
    value: string;
    issue: UsernameIssue | null;
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

const checkDuplicates = async (name: string) => {
    try {
        const response = await fetch("/api/checks/username-available", { body: JSON.stringify({ name }), method: "PUT" });
        const json = await response.json();
        return !!json.output;
    } catch (_) { return false; }
};

function reducer(prevState: CheckState, action: Action): CheckState {
    switch (action.__type) {
        case "update": {
            if (!action.value) return {
                ...prevState,
                issue: null,
                value: action.value,
                output: "failure",
            };

            const issue = getUsernameIssue(action.value);
            if (issue) {
                actionIds.update = -1;
                actionIds.clear = -1;
                actionIds.recieve = -1;

                return {
                    ...prevState,
                    issue,
                    value: action.value,
                    output: "failure",
                };
            }

            if (prevState.value === action.value) return prevState;
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
                issue,
                value,
                output: "stalesuccess",
            };
        }

        case "clear": {
            const { id, dispatch, value } = action;

            if (id === actionIds.update && id !== actionIds.clear) {
                actionIds.clear = id;
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
            }
            if (prevState.value === action.forValue) return {
                ...prevState,
                output: action.success ? "success" : "failure",
            };
            else return prevState;
        }
    }
}

type HookReturn = [string, UsernameIssue | null, VerificationState, (v: string) => void];
const useUsernameValidation = (): HookReturn => {
    const [state, dispatch] = useReducer<typeof reducer>(reducer, { issue: null, output: "failure", value: "" });

    const update = useCallback(
        (value: string) => dispatch({ __type: "update", value, dispatch }),
        [dispatch],
    );

    const retVal = useMemo<HookReturn>(
        () => [state.value, state.issue, state.output, update],
        [state.value, state.output, state.issue, update],
    );

    return retVal;
};

export default useUsernameValidation;
