// Components


// Hooks


// Types
import React, { FC } from "react"
import { ClientSideMeta as ClientSideMetaUser } from "cache/users";
import { CachedTeamMeta } from "cache/teams";
import Link from "next/link";
import NoSsr from "components/NoSsr/NoSsr";



// Styles


// Utils


interface UserCardProps {
    user: ClientSideMetaUser;
    team: CachedTeamMeta | null;
    userImgHref: string | null;
    isMe: boolean;
}

const TeamLink: FC<{ team: CachedTeamMeta | null, isMe: boolean }> = ({ team, isMe }) => {
    const baseStyles = `
        min-w-15 h-20
        border-2 border-slate-500 rounded-lg
        flex flex-col items-center justify-center
        text-lg text-slate-200
    `;
    const baseActionStyles = `
        w-full px-4 flex-grow
        flex flex-row items-center text-center
        bg-opacity-25 group`;
    if (team) return <Link href={`/team/${team.id}`}>
        <div className={baseStyles + "bg-indigo-700 font-bold"}>
            Team
            <span>{team.name} →</span>
        </div>
    </Link>;
    else if (isMe) return <div className={baseStyles + "bg-slate-700"}>
        <Link href={"/team/new"} className={`${baseActionStyles} bg-blue-500`}>
            <span>Create Team</span>
            <span className="ml-auto group-hover:scale-125 transition-transform duration-200">+</span>
        </Link>
        <Link href={"/team/join"} className={`${baseActionStyles} bg-green-500`}>
            <span>Join Team</span>
            <span className="ml-auto group-hover:translate-x-1 transition-transform duration-200">→</span>
        </Link>
    </div>;
    else return <div className={baseStyles + "bg-slate-700"}>
        No Team
    </div>;
}

const formatDate = (dateNum: number) => {
    const date = new Date(dateNum * 1000);
    const ending = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) return ending;
    else return `${ending}, ${date.toLocaleDateString()}`;
};

const UserCard: FC<UserCardProps> = ({ user: { name, lastSolve, score, type }, team, isMe }) => (
    <div
        className="
            border-2 border-slate-700 bg-slate-900 min-w-15 max-w-50 w-screen/3
            flex flex-col items-center px-8 py-10">
        <h2 className="text-5xl mb-6">{name}</h2>
        <span className="text-xl mb-0.5">{score} points</span>
        <NoSsr>{lastSolve ? <span className="text-xl mb-0.5">Last solve at: {formatDate(lastSolve)}</span> : <></>}</NoSsr>
        <span className="text-xl mt-6 mb-8">{type !== "admin" ? "Participant" : "Non-Participant"}</span>
        <TeamLink team={team} isMe={isMe} />       
    </div>
);

export default UserCard;
