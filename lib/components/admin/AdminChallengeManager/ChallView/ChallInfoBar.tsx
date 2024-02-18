import { CachedChall } from "cache/challs";
import { CachedSolveMeta } from "cache/solves";
import NoSsr from "components/NoSsr/NoSsr";
import React from "react";

export interface ChallInfoBarProps {
    challenge: CachedChall;
    solves: CachedSolveMeta[];
}

const getSolveTimeString = (time: number) => {
    const date = new Date(time * 1000);
    return date.toLocaleString();
};

const ChallInfoBar: React.FC<ChallInfoBarProps> = ({ challenge, solves }) => {
    const firstSolve = solves.sort((a, b) => a.time - b.time)[0];
    const solveTime = firstSolve?.time ? getSolveTimeString(firstSolve.time) : "N/A";

    return (
        <div className="flex flex-row flex-wrap align-middle space-x-2">
            <span className="w-24">{solves.length} solve(s)</span>
            <span className="w-24">{challenge.clientSideMetadata.points} points</span>
            <span className="w-44 overflow-ellipsis overflow-hidden whitespace-nowrap">Categories: {challenge.clientSideMetadata.categories.join(", ")}</span>
            <NoSsr><span className="w-72">Blooded @ {solveTime}</span></NoSsr>
        </div>
    );
}

export default ChallInfoBar;
