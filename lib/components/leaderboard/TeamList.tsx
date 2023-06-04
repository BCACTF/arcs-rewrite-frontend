// Components


// Hooks


// Types

import { teamIdToStr } from "cache/ids";
import { CachedTeamMeta } from "cache/teams";
import NoSsr from "components/NoSsr/NoSsr";
import Link from "next/link";
import React, { FC } from "react"


// Styles


// Utils


interface TeamListProps {
    teams: CachedTeamMeta[];
}
type TeamRowProps = (CachedTeamMeta & { isHeader: false, idx: number }) | (Omit<CachedTeamMeta, "id"> & { idx: number, isHeader: true, id?: unknown });

const getPositionColor = (idx: number) => {
    switch(idx) {
        case 0:
            return "text-leaderboard-firstplace-number-color";
        case 1:
            return "text-leaderboard-secondplace-number-color";
        case 2:
            return "text-leaderboard-thirdplace-number-color";
        default:
            return "text-leaderboard-number-color";
    }
};

const formatDate = (dateNum: number) => {
    const date = new Date(dateNum * 1000);
    const ending = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "numeric" });
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) return ending;
    else return `${ending}, ${date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}`;
};

const TeamRow: FC<TeamRowProps> = ({ name, id, affiliation, eligible, lastSolve, score, isHeader, idx }) => (
    <Link href={isHeader ? "#" : `/team/${id}`}><div
        className={`
            flex flex-row
            transition-colors
            ${isHeader ? "" : "hover:bg-leaderboard-row-hover-color"}
            border-b-2
            px-2 sm:px-8 py-6
            ${isHeader ? "font-bold border-b-4 cursor-default" : "hover:"}`}>
        <code className={
            `w-8 sm: mr-4 
                ${
                    isHeader ? "text-leaderboard-header-color" : getPositionColor(idx)
                }`
            }>
            {isHeader ? " " : (idx + 1 + ".")}
        </code>
        <code
            className="w-72 overflow-ellipsis">{name}
        </code>
        <code className="max-sm:hidden w-64 mx-4 text-center overflow-ellipsis overflow-clip whitespace-nowrap">
            {isHeader ? "Affiliation" :  (affiliation ?? "None")}
        </code>
        <code
            className="w-52 text-right sm:text-center">{isHeader ? "Score" : score}
        </code>
        <div className="max-sm:hidden w-52 text-center">
            <code className="mx-auto place">
                {isHeader ? "Eligibility" : (eligible ? "Eligible" : "Ineligible")}
            </code>
        </div>
        <div className="ml-auto max-sm:hidden w-52 text-center">
            <NoSsr>
                {!isHeader && lastSolve ? <code>{formatDate(lastSolve)}</code> : <></>}
                {isHeader ? <code>Last Solve</code> : <></>}
            </NoSsr>
        </div>
    </div></Link>
);

const TeamList: FC<TeamListProps> = ({ teams }) => (
    <div className="flex flex-col w-11/12 mx-auto">
        <TeamRow name="Name" score={0} lastSolve={null} eligible={true}  affiliation="Affiliation" isHeader={true} idx={-1}/>
        {teams.map((team, idx) => <TeamRow {...team} key={teamIdToStr(team.id)} isHeader={false} idx={idx}/>)}
    </div>
);

export default TeamList;
