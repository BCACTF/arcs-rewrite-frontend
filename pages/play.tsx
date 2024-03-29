// Components
import WebsiteMeta from "components/WebsiteMeta";
import ChallDropList from "components/challenges/drop/ChallDropList";
import FilterView from "components/filter-view/FilterView";
import HeaderBanner, { HeaderBannerPage } from "components/HeaderBanner";

// Hooks
import useFilter from "hooks/useFilter";
import { useMemo } from "react";

// Types
import React, { FC } from "react";
import { Competition } from "metadata/client";
import { ClientSideMeta as ClientSideMetaChalls } from "cache/challs";
import { Account } from "account/validation";
import { CachedSolveMeta } from "cache/solves";
import { ChallDropProps } from "components/challenges/drop/parts/ChallDrop";

// Utilities
import getCompetition from "metadata/client";
import { getAllChallenges, sortBy } from "cache/challs";
import getAccount from "account/validation";
import { pageLogger, wrapServerSideProps } from "logging";
import { getSolves } from "cache/solves";


interface PlayProps {
    metadata: Competition;
    challenges: ClientSideMetaChalls[];
    teamSolves: CachedSolveMeta[];
    account: Account;
}

const Play: FC<PlayProps> = ({ metadata, challenges, teamSolves, account }) => {
    const filterState = useFilter();

    const solvedIds = useMemo(() => new Map(teamSolves.flatMap(
        solve => solve.teamId === account.teamId
            ? [[solve.challId, solve.userId === account.userId] as const]
            : []
    )), [account, teamSolves]);

    const filteredChallenges = useMemo(
        () => challenges.filter(chall => filterState.matches(chall)),
        [challenges, filterState],
    );

    const challengesWithSolves = useMemo(
        () => challenges.map(chall => ({...chall, solved: solvedIds.has(chall.id) })),
        [challenges],
    );

    const challengeProps: ChallDropProps[] = useMemo(
        () => filteredChallenges.map(
            chall => ({
                metadata: chall,
                solved: { byTeam: solvedIds.has(chall.id), byUser: solvedIds.get(chall.id) ?? false },
                submission: { challId: chall.id, teamId: account.teamId, userId: account.userId }
            })
        ),
        [filteredChallenges, solvedIds],
    );

    return (
        <div className="flex flex-col items-center justify-start w-screen h-full min-h-60 pb-4">
            <WebsiteMeta metadata={metadata} pageName="Play"/>

            <HeaderBanner account={account} meta={metadata} currPage={HeaderBannerPage.PLAY} />

            {
                account.admin ? (
                    <span className="text-center text-xl font-bold pt-3 pb-4">Admin View</span>
                ) : null
            }

            <div className="flex flex-row flex-grow h-min gap-x-4">
                {
                    // to whoever maintains this code in the future, I am so
                    // sorry - yusuf june 3rd 2023
                    // I fixed it - Sky, August 27, 2023
                    // it was not fixed, but now it is! - Yusuf, August 27, 2023
                    (metadata.start <= Date.now() / 1000) || account.admin
                        ? (
                            <div className="flex flex-row place-content-between px-4 sm:px-8 w-screen h-full overflow-y-hidden">
                                <div className="max-sm:hidden w-[23%] mr-2 md:mr-4">
                                    <FilterView filterState={filterState} challs={challengesWithSolves}/>
                                </div>
                                <ChallDropList cards={challengeProps}/>        
                            </div>                            
                        )
                        : (
                            <div className="flex flex-col items-center justify-center flex-grow h-full gap-y-4">
                                <div className="text-2xl font-bold text-center text-navbar-text-color-dark">
                                    Event has not started yet
                                </div>
                            </div>
                        )
                }
            </div>
        </div>
    )
}

export const getServerSideProps = wrapServerSideProps<PlayProps>(async function PlaySSP(context) {
    pageLogger.info`Recieved request for ${context.resolvedUrl}`;

    const [
        account,
        challengesRaw,
        metadata,
    ] = await Promise.all([
        getAccount(context),
        getAllChallenges(),
        getCompetition(),
    ]);

    if (!account) return {
        redirect: {
            permanent: false,
            destination: "/account/signin",
        },
    };

    if (!account.teamId) return {
        redirect: {
            permanent: false,
            destination: "/team/join",
        },
    };

    pageLogger.debug`Challenge count: ${challengesRaw.length}`;

    const teamSolves = await getSolves(account.teamId);

    let challenges : ClientSideMetaChalls[] = [];

    if( metadata.start <= Date.now() / 1000) {
        challenges = sortBy(challengesRaw.filter(chall => chall.visible))
            .map(chall => chall.clientSideMetadata);
    } else if (account.admin) {
        challenges = sortBy(challengesRaw).map(chall => chall.clientSideMetadata);  // display all challs to admins at all times
    }


    
    const props = {
        metadata,
        challenges,
        teamSolves,
        account,
    };
    return { props };
});

export default Play;
