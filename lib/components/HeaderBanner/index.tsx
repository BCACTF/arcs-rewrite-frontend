// Components
import AccountDropdown from "./AccountDropdown";
import SignInButton from "./SignInButton";
import Link from "next/link";

// Hooks


// Types
import React, { FC, useState } from "react"
import { Competition } from "metadata/client";
import { Account } from "account/validation";

// Styles


// Utils




interface HeaderBannerProps {
    account: Account | null;
    meta: Competition;
    currPage: HeaderBannerPage | null;
}

interface BannerLinkProps {
    href: string;
    text: string;
    curr: boolean;
}

const BannerLink: FC<BannerLinkProps> = ({ href, text, curr }) => (
    <Link href={curr ? "#" : href} className={`text-lg ${curr ? "cursor-default" : ""}`}>{text}</Link>
);

export enum HeaderBannerPage {
    HOME = "Home",
    PLAY = "Play",
    LEAD = "Leaderboard",
    RULE = "Rules",
    ABOUT = "About"
}

const linkMapping: Record<HeaderBannerPage, string> = {
    [HeaderBannerPage.HOME]: "/",
    [HeaderBannerPage.PLAY]: "/play",
    [HeaderBannerPage.LEAD]: "/scoreboard",
    [HeaderBannerPage.RULE]: "/rules",
    [HeaderBannerPage.ABOUT]: "/about"
};

const HeaderBanner: FC<HeaderBannerProps> = ({ account, meta, currPage }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const genericHamburgerLine = `h-1 w-7 my-1 rounded-full bg-navbar-text-color-normal transition ease transform duration-300`;

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    } 

    function setTransition(menuOpen : boolean) {
        if (!menuOpen) {
            return " transition-all duration-500 h-0 p-0 px-7 "
        } else {
            // return ` transition-all duration-500 p-3 py-3 px-7 h-${links.length * 8}`
            // TODO --> figure out a nicer thing for the height of navbar extension on mobile?
            return (account ? `transition-all duration-500 h-72` : `transition-all duration-500 h-48`)
        }
    }

    return (
        <div className="w-screen bg-navbar-background-color max-sm:bg-navbar-background-color-mobile-only sm:backdrop:backdrop-blur-md mb-4 h-16 sticky top-0">
            <div className="max-sm:hidden flex flex-row h-full">
                <Link href="/" className="text-2xl my-auto font-semibold text-navbar-text-color ml-5 pr-5 border-r-2 border-navbar-text-color-dark text-center text-navbar-event-name">
                    {meta.name} 
                </Link>
                {[ HeaderBannerPage.PLAY, HeaderBannerPage.LEAD, HeaderBannerPage.RULE, HeaderBannerPage.ABOUT ]
                    .map((page, idx) => 
                        <div className="
                            my-auto ml-3 pr-3 md:ml-5 md:pr-5
                            text-navbar-text-color-normal
                            hover:text-navbar-text-color-dark"
                            key={idx}>
                            <BannerLink
                                href={linkMapping[page]}
                                text={page}
                                curr={page === currPage}
                                key={page} />
                        </div>
                        )
                }
                <div className="ml-auto mr-4 my-auto">
                    {account
                        ? <AccountDropdown {...account} />
                        : <SignInButton/>
                    }
                </div>
            </div>
            <div className='sm:hidden'>
                <div className="w-screen h-1/5 p-3 flex flex-row place-content-between ">
                    <Link href="#" className="text-xl my-auto font-semibold text-navbar-text-color-normal">
                        {meta.name} 
                    </Link>
                    <button
                        className="flex flex-col h-10 w-10 my-auto mx-2.5 ml-auto rounded justify-center items-center group"
                        onClick={() => { setIsOpen(!isOpen); toggleMenu(); } }
                        >
                        <div
                            className={`${genericHamburgerLine} ${
                            isOpen
                                ? "rotate-45 translate-y-3 "
                                : ""
                            }`}
                        />
                        <div
                            className={`${genericHamburgerLine} ${
                            isOpen ? "opacity-0" : ""
                            }`}
                        />
                        <div
                            className={`${genericHamburgerLine} ${
                            isOpen
                                ? "-rotate-45 -translate-y-3 "
                                : ""
                            }`}
                        />
                    </button>
                </div>
                <div className={" \
                    flex-grow p-0 pt-0 h-0 flex \
                    flex-col text-right px-7 overflow-auto \
                    w-screen bg-navbar-background-color  \
                    max-sm:bg-navbar-background-color-mobile-only \
                    shadow-md rounded-b-md " + setTransition(menuOpen)}>
                    {[ HeaderBannerPage.HOME, HeaderBannerPage.PLAY, HeaderBannerPage.LEAD, HeaderBannerPage.RULE, HeaderBannerPage.ABOUT ]
                        .map((page, idx) => 
                            <div className="
                                hover:drop-shadow-md transition
                                text-navbar-text-color-normal
                                hover:text-navbar-text-color-dark p-auto pb-1"
                                key={idx}>
                                <BannerLink
                                    href={linkMapping[page]}
                                    text={page}
                                    curr={page === currPage}
                                    key={page} />
                            </div>
                            )
                    }
                    <hr className="border-navbar-text-color-dark w-1/3 ml-auto mt-1 border-y-[1px]"></hr>
                    <div className="pt-2">
                        {account
                            ? <AccountDropdown {...account} />
                            : <SignInButton/>
                        }
                    </div>
                </div> 
            </div>
        </div>
    );
};

export default HeaderBanner;
