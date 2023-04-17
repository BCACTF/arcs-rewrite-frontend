// Components


// Hooks


// Types

import { ClientSideMeta as ClientSideMetaChall } from "cache/challs";
import { CachedSolveMeta } from "cache/solves";
import { ClientSideMeta as ClientSideMetaUser } from "cache/users";
import NoSsr from "components/NoSsr/NoSsr";
import Link from "next/link";
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
    <div className="flex flex-col py-8 w-screen/2 min-w-min bg-slate-900">
        <div className="flex flex-row px-6 py-4 border-b-2 border-b-slate-700 font-bold">
            <span className="w-48">User</span>
            <span className="w-60 text-center">Challenge</span>
            <span className="w-24 text-center">Points</span>
            <span className="ml-auto text-right">Time</span>
        </div>
        {solves.map((solve, idx) => (
            <div className="flex flex-row px-6 py-4 border-b border-b-slate-700" key={idx}>
                <span className="w-48">{users.find(u => u.userId === solve.userId)?.name}</span>
                <span className="w-60 text-center">{challs.find(c => c.id === solve.challId)?.name}</span>
                <span className="w-24 text-center">{challs.find(c => c.id === solve.challId)?.points}</span>
                <NoSsr><span className="ml-auto text-right">{formatDate(solve.time)}</span></NoSsr>
            </div>
        ))}
    </div>
);

export default SolveList;
