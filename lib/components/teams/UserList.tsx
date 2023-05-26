// Components


// Hooks


// Types

import { ClientSideMeta as ClientSideMetaUser } from "cache/users";
import Link from "next/link";
import React, { FC } from "react"


// Styles


// Utils


interface UserListProps {
    users: ClientSideMetaUser[];
}


const UserList: FC<UserListProps> = ({ users }) => (
    <div className="flex flex-col w-1/3 p-3 border border-opacity-25 border-team-boxes-border-color bg-team-boxes-background-color bg-opacity-5 rounded-lg">
        <div className="flex flex-row justify-between p-4 border-b-2 border-b-team-line-color font-bold">
            <span>Name</span>
            <span>Score</span>
        </div>
        {users.map((user, idx) => <Link href={`/account/${user.userId}`} key={idx}>
            <div className="flex flex-row justify-between p-4 border-b border-team-line-color bg-opacity-85 hover:bg-team-entry-hover-color transition delay-[5ms]">
                <span>{user.name}</span>
                <span>{user.score}</span>
            </div>
        </Link>)}
    </div>
);

export default UserList;
