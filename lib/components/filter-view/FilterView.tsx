// Components
import ChallCheckFilter from "./parts/ChallCheckFilter";
import PointsRangeFilter from "./parts/PointsRangeFilter";


// Hooks


// Types
import React, { FC, useEffect, useMemo } from "react"
import { ClientSideMeta } from "cache/challs";
import { FilterStateHook } from "hooks/useFilter";

// Styles

// Utils





interface FilterViewProps {
    filterState: FilterStateHook;
    challs: ClientSideMeta[];
}

const FilterView: FC<FilterViewProps> = ({ filterState, challs }) => {
    const categories = useMemo(
        () => [...new Set(challs.flatMap(c => c.categories).map(s => s.toUpperCase())).values()].sort(),
        [challs],
    );
    const tags = useMemo(
        () => [...new Set(challs.flatMap(c => c.tags).map(s => s.toUpperCase())).values()].sort(),
        [challs],
    );
    const points = useMemo(() => challs.map(c => c.points), [challs]);
    const pointsMax = useMemo(() => Math.max(...points), [points]);

    useEffect(() => {
        const pointsNeedSet = !filterState.currState.points;
        if (pointsNeedSet) {
            filterState.clearPoints([0, pointsMax]);
        }
    }, [pointsMax, filterState]);

    const categorySelectors = <ChallCheckFilter
        list={categories}
        heading="Categories:"
        has={cat => filterState.currState.categories?.has(cat) ?? false}
        set={(cat, val) => filterState.setCategory(cat, val)}/>;
    const tagSelectors = <ChallCheckFilter
        list={tags}
        heading="Tags:"
        has={tag => filterState.currState.tags?.has(tag) ?? false}
        set={(tag, val) => filterState.setTag(tag, val)}/>;
    const pointSelectors = <PointsRangeFilter
        max={pointsMax}
        range={filterState.currState.points ?? [0, pointsMax]}
        set={{ low: filterState.setPointsLow, high: filterState.setPointsHigh, unknown: filterState.setUnknownBound }}
        stops={points}/>


    return <div className="flex flex-col justify-start items-start w-60 border-2 border-gray-600 p-4">
        {categorySelectors}

        {pointSelectors}

        {tagSelectors}
    </div>;
};

export default FilterView;
