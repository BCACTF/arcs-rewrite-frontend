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
    <div className="flex flex-col py-8 pt-2 w-screen/2 min-w-min bg-slate-900">
        <div className="flex flex-row justify-between p-4 border-b-2 border-b-slate-700 font-bold">
            <span>Name</span>
            <span>Score</span>
        </div>
        {users.map((user, idx) => <Link href={`/account/${user.userId}`} key={idx}>
            <div className="flex flex-row justify-between p-4 border-b border-b-slate-700 hover:bg-slate-800 transition-colors">
                <span>{user.name}</span>
                <span>{user.score}</span>
            </div>
        </Link>)}
    </div>
);

export default UserList;
