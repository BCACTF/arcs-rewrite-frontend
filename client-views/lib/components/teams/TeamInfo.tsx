// Components


// Hooks


// Types

import { CachedTeamMeta } from "cache/teams";
import NoSsr from "components/NoSsr/NoSsr";
import React, { FC } from "react";


// Styles


// Utils


interface TeamInfoProps {
    team: CachedTeamMeta;
}

interface EligProps {
    elig: boolean;
    aff: string | null;
}
const Eligibility: FC<EligProps> = ({ elig: eligible, aff: affiliation }) => {
    if (eligible && affiliation) return <code className="flex flex-col items-center mt-7 text-xl">
        <span>Eligible for prizes</span>
        <span>{affiliation}</span>
    </code>;
    else return <code className="text-xl mt-7">Ineligible for prizes</code>
};

const formatDate = (dateNum: number) => {
    const date = new Date(dateNum * 1000);
    const ending = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) return ending;
    else return `${ending}, ${date.toLocaleDateString()}`;
};

const TeamInfo: FC<TeamInfoProps> = ({ team: { name, score, lastSolve, eligible, affiliation } }) => (
    <div className="flex flex-col items-center p-8 w-screen/2 min-w-min bg-slate-900 border-b-slate-700 border-b-2">
        <code className="text-4xl mb-7">{name}</code>
        <code className="text-xl mb-1">{score} Points</code>
        <NoSsr>{lastSolve ? <code className="text-xl mb-0.5">Last solve at: {formatDate(lastSolve)}</code> : <></>}</NoSsr>

        <Eligibility elig={eligible} aff={affiliation} />
    </div>
);

export default TeamInfo;
