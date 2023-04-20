// Components
import Link from 'next/link';

// Hooks


// Types
import React, { FC, useState } from "react"
import { Account } from 'account/validation';


// Styles


// Utils



interface DropdownEntryProps {
    href: string;
    entryText: string;
    open: boolean;
}
export const DropdownEntry: FC<DropdownEntryProps> = ({ href, entryText, open }) => (
    <Link href={href} className="flex items-center justify-center w-full h-10 hover:bg-opacity-10 hover:bg-white group">
        <span className="ml-4">{entryText}</span>
        <span className="ml-auto mr-6 group-hover:translate-x-1 transition-transform">→</span>
    </Link>
);


const AccountDropdown: FC<Account> = (
    {
        clientSideMetadata: {
            name,
            userId,
        },
    },
) => {
    const [open, setDropdownOpen] = useState(false);

    return (
        <div className={`
            flex flex-row justify-end items-center
            w-60 h-9 py-2 relative
            rounded-t-2xl  transition-all duration-200
            bg-navbar-dropdown-background-color
            select-none cursor-pointer
            ${open ? "rounded-b-none" : "rounded-b-2xl"}`}
            onClick={() => setDropdownOpen(b => !b)}>
            <span className=" mr-2 ml-4 overflow-ellipsis overflow-clip">
                {name}
            </span>
            <div className={`
                w-2 h-2 mr-6 ml-auto
                border-b-3 border-r-3
                border-white
                transition-transform duration-200
                ${open ? "-rotate-135" : "rotate-45"}`}/>
            <div className={`
                flex flex-col justify-center pt-9
                absolute top-0 left-0 w-full -z-10
                border-r-2xl overflow-clip rounded-2xl
                bg-navbar-dropdown-background-color
                transition-all duration-200
                ${open ? "h-39" : "h-0"}`}>
                <DropdownEntry href={`/account/${userId}`} entryText={"User Stats"} open={open}/>
                <DropdownEntry href={"/account/settings"} entryText={"Settings"} open={open}/>
                <DropdownEntry href={"/account/signout"} entryText={"Sign Out"} open={open}/>
            </div>
        </div>
    );
};

export default AccountDropdown;
