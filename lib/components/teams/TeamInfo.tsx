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

// interface EligProps {
//     elig: boolean;
//     aff: string | null;
// }
// const Eligibility: FC<EligProps> = ({ elig: eligible, aff: affiliation }) => {
//     if (eligible && affiliation) return <code className="flex flex-col items-center mt-7 text-xl">
//         <span className="text-2xl">{affiliation}</span>
//         <span className="text-sm">Eligible for prizes</span>
//     </code>;
//     else return <code className="text-xl mt-7">Ineligible for prizes</code>
// };

function is_eligible(eligible: boolean, affiliation: string | null): boolean {
    if (eligible && affiliation) return true; // i may have broken something with this
    return false;
}

const formatDate = (dateNum: number) => {
    const date = new Date(dateNum * 1000);
    const ending = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) return ending;
    else return `${ending}, ${date.toLocaleDateString()}`;
};

const TeamInfo: FC<TeamInfoProps> = ({ team: { name, score, lastSolve, eligible, affiliation } }) => (
    <div className="flex flex-col items-center p-8">
        <code className="text-[1.6rem] sm:text-[2rem] pb-1 font-semibold">Team</code>
        <code className="text-[1.8rem] sm:text-[2.4rem] mb-3 font-semibold text-team-team-name-color">{name}</code>
        
        {
            is_eligible(eligible, affiliation) ? (
                <code className="flex flex-col items-center mb-5 text-xl">
                    <span className="text-xl">{affiliation}</span>
                </code>
            ) : null
        }

        <hr className="border border-team-line-color w-1/2"></hr>

        <code className="text-2xl mt-5 mb-1 font-bold">{score} Points</code>
        <code className="flex flex-col items-center mt-6 text-xl">
            <span className="text-md">
            {
                (is_eligible(true, affiliation)) ? "Eligible for prizes" : "Ineligible for prizes"
            }
            </span>
        </code>
        {/* <NoSsr>{lastSolve ? <code className="text-xl mb-0.5">Last solve at: {formatDate(lastSolve)}</code> : <></>}</NoSsr> */}
        {/* <Eligibility elig={eligible} aff={affiliation} /> */}
    </div>
);

export default TeamInfo;
