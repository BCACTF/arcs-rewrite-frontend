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
        border-2 border-user-profile-button-border-color rounded-lg
        flex flex-col items-center justify-center
        text-lg text-user-profile-button-text-color
    `;
    const baseActionStyles = `
        w-full px-4 flex-grow
        flex flex-row items-center text-center
        bg-opacity-25 group`;
    if (team) return (
        <Link href={`/team/${team.id}`}>
            <div className={baseStyles + "bg-user-profile-button-background-color font-bold"}>
                Team
                <span>{team.name} →</span>
            </div>
        </Link>
    )
    else if (isMe) return (
        <div className={baseStyles + "bg-user-profile-button-background-color"}>
            <Link href={"/team/new"} className={`${baseActionStyles} bg-user-profile-create-team-background-color`}>
                <span>Create Team</span>
                <span className="ml-auto group-hover:scale-125 transition-transform duration-200">+</span>
            </Link>
            <Link href={"/team/join"} className={`${baseActionStyles} bg-user-profile-join-team-background-color`}>
                <span>Join Team</span>
                <span className="ml-auto group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
        </div>
    )
    else return (
        <div className={baseStyles + "bg-user-profile-no-team-background-color"}>
            No Team
        </div>
    )
}

const formatDate = (dateNum: number) => {
    const date = new Date(dateNum * 1000);
    const ending = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) return ending;
    else return `${ending}, ${date.toLocaleDateString()}`;
};

const UserCard: FC<UserCardProps> = ({ user: { name, lastSolve, score, admin }, team, isMe }) => (
    <div
        className="
            bg-user-profile-card-color bg-opacity-20 rounded-lg border-2 border-user-profile-card-color border-opacity-25 min-w-15 max-w-50 w-screen/3
            flex flex-col items-center px-8 py-8 text-user-profile-text-color">
        <h2 className="text-5xl font-semibold mb-3">{name}</h2>
        <span className="text-xl mb-3">{admin ? "Non-Participant" : "Participant"}</span>
        <span className="text-xl mt-2 mb-3">{score} points</span>
        <NoSsr>{lastSolve ? <span className="text-xl mb-5">Last solve at: {formatDate(lastSolve)}</span> : <></>}</NoSsr>
        <TeamLink team={team} isMe={isMe} />       
    </div>
);

export default UserCard;
