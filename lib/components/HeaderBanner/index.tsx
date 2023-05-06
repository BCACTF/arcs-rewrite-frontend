// Components
import AccountDropdown from "./AccountDropdown";
import SignInButton from "./SignInButton";
import Link from "next/link";

// Hooks


// Types
import React, { FC } from "react"
import { CompetitionMetadata } from "metadata/general";
import { Account } from "account/validation";

// Styles


// Utils




interface HeaderBannerProps {
    account: Account | null;
    meta: CompetitionMetadata;
    currPage: HeaderBannerPage | null;
}

interface BannerLinkProps {
    href: string;
    text: string;
    curr: boolean;
}

const BannerLink: FC<BannerLinkProps> = ({ href, text, curr }) => (
    <Link href={curr ? "#" : href} className={`py-4 px-4 mx-4 ${curr ? "cursor-default" : ""}`}>{text}</Link>
);

export enum HeaderBannerPage {
    HOME = "Home",
    PLAY = "Play",
    LEAD = "Leaderboard",
}

const linkMapping: Record<HeaderBannerPage, string> = {
    [HeaderBannerPage.HOME]: "/",
    [HeaderBannerPage.PLAY]: "/play",
    [HeaderBannerPage.LEAD]: "/scoreboard",
};

const HeaderBanner: FC<HeaderBannerProps> = ({ account, meta, currPage }) => {
    return (
        <nav className="
            fixed top-0 left-0 w-screen h-16
            flex flex-row items-center px-4
            bg-navbar-background-color backdrop:backdrop-blur-md
            bg-opacity-40">
            <h1 className="text-2xl font-mono pl-4 pr-8 text-navbar-text-color-normal border-r-2">{meta.name}</h1>
            {/* <h1 className="text-3xl font-mono pl-2 bg-text-banner-text-color-normal"></h1> */}
            {[ HeaderBannerPage.HOME, HeaderBannerPage.PLAY, HeaderBannerPage.LEAD ]
                .map(page => 
                    <div className="hover:drop-shadow-md transition text-navbar-text-color-normal hover:text-navbar-text-color-dark p-auto">
                        <BannerLink
                            href={linkMapping[page]}
                            text={page}
                            curr={page === currPage}
                            key={page} />
                    </div>
                    )
            }
            <div className="flex-grow"/>
            {account
                ? <AccountDropdown {...account} />
                : <SignInButton/>
            }
        </nav>
    );
};

export default HeaderBanner;
