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
    open: boolean; // TODO: Figure out if this is still useful or needed whatsoever.
}
export const DropdownEntry: FC<DropdownEntryProps> = ({ href, entryText }) => (
    <Link href={href} className="flex items-center justify-center w-full h-10 hover:bg-opacity-10 sm:hover:bg-navbar-account-dropdown-hover-color group max-sm:text-navbar-text-color-normal sm:text-navbar-account-dropdown-text-color">
        <span className="max-sm:hover:text-navbar-text-color-dark max-sm:ml-auto  max-sm:text-lg sm:ml-4">{entryText}</span>
        <span className="max-sm:hidden sm:ml-auto sm:mr-6 group-hover:translate-x-1 transition-transform">→</span>
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
        <div className="sm:my-auto">
            {/* mobile */}
            <div className={`sm:hidden
                flex flex-col justify-end
                h-32 ml-auto
                rounded-t-2xl transition-all duration-200
                select-none cursor-pointer rounded-b-2xl`}>
                <span className="overflow-ellipsis text-navbar-text-color-normal text-[1.2rem] font-semibold pb-1">
                    {name}
                </span>
                <DropdownEntry href={`/account/${userId}`} entryText={"User Stats"} open={open}/>
                <DropdownEntry href={"/account/settings"} entryText={"Settings"} open={open}/>
                <DropdownEntry href={"/account/signout"} entryText={"Sign Out"} open={open}/>
            </div>
            {/* not mobile */}
            <div className={` max-sm:hidden
                flex flex-row justify-end items-center
                md:w-54 lg:w-60 h-9 py-2 relative
                rounded-t-2xl  transition-all duration-200
                bg-navbar-account-dropdown-background-color
                hover:navbar-account-dropdown-background-color-hover
                select-none cursor-pointer
                ${open ? "rounded-b-none" : "rounded-b-2xl"}`}
                onClick={() => setDropdownOpen(b => !b)}>
                <span className=" mr-2 ml-4 overflow-ellipsis overflow-clip text-navbar-account-dropdown-text-color z-10">
                    {name}
                </span>
                <div className={`
                    w-2 h-2 mr-6 ml-auto
                    border-b-3 border-r-3
                    border-navbar-account-dropdown-text-color
                    transition-transform duration-200 z-10 
                    ${open ? "-rotate-135" : "rotate-45"}`}/>
                <div className={`
                    flex flex-col justify-center pt-9
                    absolute top-0 left-0 w-full
                    border-r-2xl overflow-clip rounded-2xl
                    bg-navbar-account-dropdown-background-color
                    transition-all duration-200 -z-10
                    ${open ? "h-39" : "h-0"}`}>
                    <DropdownEntry href={`/account/${userId}`} entryText={"User Stats"} open={open}/>
                    <DropdownEntry href={"/account/settings"} entryText={"Settings"} open={open}/>
                    <DropdownEntry href={"/account/signout"} entryText={"Sign Out"} open={open}/>
                </div>
            </div>
        </div>
    );
};

export default AccountDropdown;
