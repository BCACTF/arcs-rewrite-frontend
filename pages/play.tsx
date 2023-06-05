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
        <div className="flex flex-col items-center justify-start w-screen h-screen min-h-60 pb-4">
            <WebsiteMeta metadata={metadata} pageName="Play"/>

            <HeaderBanner account={account} meta={metadata} currPage={HeaderBannerPage.PLAY} />

            <div className="flex flex-row flex-grow h-min gap-x-4">

                {
                    // to whoever maintains this code in the future, I am so sorry - yusuf june 3rd 2023
                    metadata.start * 500 > (Date.now() / 2) ? (
                        <div className="flex flex-col items-center justify-center flex-grow h-full gap-y-4">
                            <div className="text-2xl font-bold text-center text-gray-500">
                                Event has not started yet
                            </div>
                        </div>
                    ) : 
                    (
                        <>
                            <FilterView filterState={filterState} challs={challenges}/>
                            <ChallDropList cards={challengeProps}/>        
                        </>
                    )
                }

            </div>
        </div>
    )
}

export const getServerSideProps = wrapServerSideProps<PlayProps>(async context => {
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
            destination: "/account/settings#team",
        },
    };

    pageLogger.debug`Challenges: ${
        challengesRaw.map(challenge => `${challenge.id}:${challenge.clientSideMetadata.name}`)
    }`;

    const teamSolves = await getSolves(account.teamId);

    let challenges : ClientSideMetaChalls[] = [];

    if( metadata.start <= Date.now() / 1000) {
        challenges = sortBy(challengesRaw.filter(chall => chall.visible))
            .map(chall => chall.clientSideMetadata);
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
