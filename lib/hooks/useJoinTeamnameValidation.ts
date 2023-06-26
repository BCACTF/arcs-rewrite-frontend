import { useCallback, useMemo, useReducer } from "react";
import getTeamnameIssue, { TeamnameIssue } from "utils/teamname";


export type VerificationState = "pending" | "success" | "stalesuccess" | "noexist" | "error" | "maxmembers";

export type TeamJoinability = "full" | "joinable" | "nonexistent";

type CheckState = {
    output: VerificationState;
    value: string;
    issue: TeamnameIssue | null;
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
    success: TeamJoinability;
    forValue: string;
};

let currId = 0;
const getId = () => currId++;

const actionIds: Record<Action["__type"], number> = {
    update: -1,
    clear: -1,
    recieve: -1,
};

const checkTeamStatus = async (name: string): Promise<TeamJoinability> => {
    try {
        const response = await fetch("/api/checks/teamname-joinable", { body: JSON.stringify({ name }), method: "PUT" });
        const json = await response.json();
        const result = json.exists ? (json.full ? "full" : "joinable") : "nonexistent";
        return result;
    } catch (_) { return "nonexistent"; }
};

function reducer(prevState: CheckState, action: Action): CheckState {
    switch (action.__type) {
        case "update": {
            if (!action.value) return {
                ...prevState,
                issue: null,
                value: action.value,
                output: "noexist",
            };

            const issue = getTeamnameIssue(action.value);
            if (issue) {
                actionIds.update = -1;
                actionIds.clear = -1;
                actionIds.recieve = -1;

                return {
                    ...prevState,
                    issue,
                    value: action.value,
                    output: "error",
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
                checkTeamStatus(prevState.value).then(result => dispatch({
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
                output: action.success === "joinable" ? "success" : (action.success === "full" ? "maxmembers" : "noexist"),
            };
            else return prevState;
        }
    }
}

type HookReturn = [string, TeamnameIssue | null, VerificationState, (v: string) => void];
const useJoinTeamnameValidation = (): HookReturn => {
    const [state, dispatch] = useReducer<typeof reducer>(reducer, { issue: null, output: "noexist", value: "" });

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

export default useJoinTeamnameValidation;