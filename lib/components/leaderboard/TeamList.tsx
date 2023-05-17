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
type TeamRowProps = (CachedTeamMeta & { isHeader: false }) | (Omit<CachedTeamMeta, "id"> & { isHeader: true, id?: unknown });

const formatDate = (dateNum: number) => {
    const date = new Date(dateNum * 1000);
    const ending = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "numeric" });
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) return ending;
    else return `${ending}, ${date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}`;
};

const TeamRow: FC<TeamRowProps> = ({ name, id, affiliation, eligible, lastSolve, score, isHeader }) => (
    <Link href={isHeader ? "#" : `/team/${id}`}><div
        className={`
            flex flex-rowitems-center flex-wrap lg:flex-nowrap
            bg-slate-900 transition-colors
            border-b-2 border-b-slate-700
            px-4 py-6
            ${isHeader ? "font-bold border-b-4 cursor-default" : "hover:bg-slate-800"}`}>
        <code
            className="w-56 overflow-ellipsis">{name}</code>
        <code
            className="w-20 text-right">{isHeader ? "Score" : score}</code>
        <NoSsr>
            {!isHeader && lastSolve ? <code className="w-52 lg:mx-10 text-center">{formatDate(lastSolve)}</code> : <></>}
            {isHeader ? <code className="w-52 lg:mx-10 text-center">Last Solve</code> : <></>}
        </NoSsr>
        <code className="w-52 ml-auto text-right">{isHeader ? "Prize Eligibility" : (eligible ? "Eligible" : "Ineligible")}</code>
        <code className="
            w-72 mx-10
            text-right
            overflow-ellipsis overflow-clip whitespace-nowrap">
            {isHeader ? "School Affiliation" :  (affiliation ?? "None")}
        </code>
    </div></Link>
);

const TeamList: FC<TeamListProps> = ({ teams }) => (
    <div className="flex flex-col">
        <TeamRow name="Name" score={0} lastSolve={null} eligible={true}  affiliation="Affiliation" isHeader={true}/>
        {teams.map(team => <TeamRow {...team} key={teamIdToStr(team.id)} isHeader={false}/>)}
    </div>
);

export default TeamList;
