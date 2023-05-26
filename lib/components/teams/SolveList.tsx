// Components


// Hooks


// Types

import { ClientSideMeta as ClientSideMetaChall } from "cache/challs";
import { CachedSolveMeta } from "cache/solves";
import { ClientSideMeta as ClientSideMetaUser } from "cache/users";
import NoSsr from "components/NoSsr/NoSsr";
import React, { FC } from "react"


// Styles


// Utils


interface SolveListProps {
    users: ClientSideMetaUser[];
    solves: CachedSolveMeta[];
    challs: ClientSideMetaChall[];
}

const formatDate = (dateNum: number) => {
    const date = new Date(dateNum * 1000);
    const ending = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) return ending;
    else return `${ending}, ${date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}`;
};

const SolveList: FC<SolveListProps> = ({ users, solves, challs }) => (
    <div className="flex flex-col w-1/3 p-3 border border-opacity-25 border-team-boxes-border-color bg-team-boxes-background-color bg-opacity-5 rounded-lg">
        <div className="flex flex-row justify-between p-4 border-b-2 border-b-team-line-color font-bold">
            <span className="w-40">User</span>
            <span className="w-48">Challenge</span>
            <span className="w-12 text-center">Points</span>
            <span className="ml-auto pl-12 text-right">Time</span>
        </div>
        {solves.map((solve, idx) => (
            <div className="flex flex-row justify-between p-4 border-b border-team-line-color bg-opacity-85 hover:bg-team-entry-hover-color transition delay-[5ms]" key={idx}>
                <span className="w-40">{users.find(u => u.userId === solve.userId)?.name}</span>
                <span className="w-48">{challs.find(c => c.id === solve.challId)?.name}</span>
                <span className="w-12 text-center">{challs.find(c => c.id === solve.challId)?.points}</span>
                <NoSsr><span className="ml-auto pl-12 text-right">{formatDate(solve.time)}</span></NoSsr>
            </div>
        ))}
    </div>
);

export default SolveList;
