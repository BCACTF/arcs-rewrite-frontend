import { ClientSideMeta } from "cache/challs";
import { useCallback, useMemo, useState } from "react";

interface FilterState {
    search: string | null;
    categories: Set<string> | null;
    tags: Set<string> | null;
    points: [number, number] | null;
}

export interface FilterStateHook {
    currState: FilterState;
    setSearch:     (newStr: string) => void;
    setCategory:   (cat: string, selected: boolean) => void;
    setTag:        (tag: string, selected: boolean) => void;
    setPointsLow:  (points: number) => void;
    setPointsHigh: (points: number) => void;
    clearPoints:   () => void;
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

    const setCategory = useCallback((category: string, selected: boolean) => {
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
        const newState: FilterState = {
            ...currState,
            points: [val, currState.points?.[1] ?? NaN],
        };
        setCurrState(newState);
    }, [currState]);
    const setPointsHigh = useCallback((val: number) => {
        const newState: FilterState = {
            ...currState,
            points: [currState.points?.[0] ?? NaN, val],
        };
        setCurrState(newState);
    }, [currState]);
    const clearPoints = useCallback(() => {
        const newState: FilterState = {
            ...currState,
            points: null,
        };
        setCurrState(newState);
    }, [currState]);

    const matches = useCallback((chall: ClientSideMeta) => {
        // if (!searchMatches(chall, currState.search)) return false;

        const stateCategories = currState.categories;
        if (stateCategories) if (!chall.categories.some(cat => stateCategories.has(cat))) return false;


        const stateTags = currState.tags;
        if (stateTags) if (!chall.tags.some(tag => stateTags?.has(tag))) return false;

        const points = currState.points;
        if (points) if (!(chall.points >= points[0]) || !(chall.points <= points[1])) return false;

        return true;
    }, [currState]);

    return useMemo(() => ({
        currState,
        
        setSearch,
        setCategory, setTag,
        setPointsLow, setPointsHigh, clearPoints,

        matches,
    }), [currState, setSearch, setCategory, setTag, setPointsLow, setPointsHigh, clearPoints, matches]);
};

export default useFilter;
