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
    <div className="flex flex-col sm:w-2/5 md:w-1/2 xl:w-2/5 m-3 border border-opacity-25 border-team-boxes-border-color bg-team-boxes-background-color bg-opacity-5 rounded-lg h-96">
        <div className="flex flex-row justify-between p-4 border-b-2 border-b-team-line-color font-bold">
            <span className="max-sm:hidden w-40">User</span>
            <span className="w-48">Challenge</span>
            <span className="max-sm:text-right w-20">Points</span>
            <span className="max-sm:hidden ml-auto w-40 text-right">Time</span>
        </div>
        <div className="overflow-y-scroll">
            {solves.map((solve, idx) => (
                <Link href={`/account/${solve.userId}`} key={idx}>
                    <div className="flex flex-row justify-between p-4 border-b border-team-line-color bg-opacity-85 hover:bg-team-entry-hover-color transition delay-[5ms]" key={idx}>
                        <span className="max-sm:hidden w-40">{users.find(u => u.userId === solve.userId)?.name}</span>
                        <span className="w-48">{challs.find(c => c.id === solve.challId)?.name}</span>
                        <span className="max-sm:text-right w-20">{challs.find(c => c.id === solve.challId)?.points}</span>
                        <NoSsr><span className="max-sm:hidden ml-auto w-40 text-right">{formatDate(solve.time)}</span></NoSsr>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);

export default SolveList;
