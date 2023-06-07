import { ClientSideMeta } from "cache/challs";
import { useCallback, useMemo, useState } from "react";

interface FilterState {
    search: string | null;
    categories: Set<string> | null;
    tags: Set<string> | null;
    points: [number, number] | null;
}

export interface FilterStateHook {
    currState:          FilterState;
    setSearch:          (newStr: string) => void;
    setCategory:        (cat: string, selected: boolean) => void;
    setTag:             (tag: string, selected: boolean) => void;
    setPointsLow:       (points: number) => void;
    setPointsHigh:      (points: number) => void;
    setUnknownBound:    (points: number) => void;
    clearPoints:        (newVal?: [number, number]) => void;

    matches:            (chall: ClientSideMeta) => void;
}

const useFilter = (): FilterStateHook => {
    const [currState, setCurrState] = useState<FilterState>({
        search: null,
        categories: null,
        tags: null,
        points: null,
    });

    const setSearch = useCallback((newStr: string) => {
        const newState: FilterState = {
            ...currState,
            search: newStr || null,
        };
        setCurrState(newState);
    }, [currState]);

    const setCategory = useCallback((categoryUnformatted: string, selected: boolean) => {
        const category = categoryUnformatted.toLowerCase();

        const newSet = new Set(currState.categories);
        if (selected) newSet.add(category);
        else newSet.delete(category);

        if (newSet.size === 0) setCurrState({ ...currState, categories: null });
        else setCurrState({ ...currState, categories: newSet });
    }, [currState]);

    const setTag = useCallback((tag: string, selected: boolean) => {
        const newSet = new Set(currState.tags);
        if (selected) newSet.add(tag);
        else newSet.delete(tag);

        if (newSet.size === 0) setCurrState({ ...currState, tags: null });
        else return setCurrState({ ...currState, tags: newSet });
    }, [currState]);

    const setPointsLow = useCallback((val: number) => {
        const [, currHigh] = currState.points ?? [val, val];
        const newLow = val;
        const newHigh =  Math.max(currHigh, val);
        const newState: FilterState = {
            ...currState,
            points: [newLow, newHigh],
        };
        setCurrState(newState);
    }, [currState]);
    const setPointsHigh = useCallback((val: number) => {
        const [currLow, ] = currState.points ?? [val, val];
        const newLow = Math.min(currLow, val);
        const newHigh =  val;
        const newState: FilterState = {
            ...currState,
            points: [newLow, newHigh],
        };
        setCurrState(newState);
    }, [currState]);
    const setUnknownBound = useCallback((val: number) => {
        const [currLow, currHigh] = currState.points ?? [val, val];

        const newLow = Math.min(val, currLow);
        const newHigh = Math.max(val, currHigh);

        const newState: FilterState = {
            ...currState,
            points: [newLow, newHigh],
        };
        setCurrState(newState);
    }, [currState]);
    const clearPoints = useCallback((newVal?: [number, number]) => {
        const newState: FilterState = {
            ...currState,
            points: newVal ?? null,
        };
        setCurrState(newState);
    }, [currState]);

    const matches = useCallback((chall: ClientSideMeta) => {
        // if (!searchMatches(chall, currState.search)) return false;

        const stateCategories = currState.categories;
        if (stateCategories) if (!chall.categories.some(cat => stateCategories.has(cat.toLowerCase()))) return false;


        const stateTags = currState.tags;
        if (stateTags) if (!chall.tags.some(tag => stateTags.has(tag.toLowerCase()))) return false;

        const points = currState.points;
        if (points) if (!(chall.points >= points[0]) || !(chall.points <= points[1])) return false;

        return true;
    }, [currState]);

    return useMemo(() => ({
        currState,
        
        setSearch,
        setCategory, setTag,
        setPointsLow, setPointsHigh, setUnknownBound, clearPoints,

        matches,
    }), [
        currState,
        setSearch,
        setCategory, setTag,
        setPointsLow, setPointsHigh, setUnknownBound, clearPoints,
        matches,
    ]);
};

export default useFilter;
