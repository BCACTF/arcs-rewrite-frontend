// Components
import WebsiteMeta from "components/WebsiteMeta";
import ChallDropList from "components/challenges/drop/ChallDropList";
import FilterView from "components/filter-view/FilterView";
import HeaderBanner, { HeaderBannerPage } from "components/HeaderBanner";

// Hooks
import useFilter from "hooks/useFilter";

// Types
import { GetServerSideProps } from "next";
import React, { FC } from "react";
import { Competition } from "metadata/client";
import { ClientSideMeta as ClientSideMetaChalls } from "cache/challs";
import { Account } from "account/validation";

// Styles


// Utilities
import getCompetition from "metadata/client";
import { getAllChallenges, sortBy } from "cache/challs";
import getAccount from "account/validation";


interface PlayProps {
    metadata: Competition;
    challenges: ClientSideMetaChalls[];
    account: Account | null;
}

const Play: FC<PlayProps> = ({ metadata, challenges, account }) => {
    const filterState = useFilter();

    return <div className="flex flex-col items-center justify-start w-screen h-screen min-h-60 pb-4">
        <WebsiteMeta metadata={metadata} pageName="Play"/>

        <HeaderBanner account={account} meta={metadata} currPage={HeaderBannerPage.PLAY} />

        <div className="flex flex-row flex-grow h-min gap-x-4">
            <FilterView filterState={filterState} challs={challenges}/>

            <ChallDropList
                cards={challenges
                    .filter(chall => filterState.matches(chall))
                    .map(chall => ({
                        metadata: chall,
                        solved: { byTeam: false, byUser: false },
                        submission: { challId: chall.id, teamId: account?.teamId ?? null, userId: account?.userId ?? null }
                    }))}/>
        </div>
    </div>
}

export const getServerSideProps: GetServerSideProps<PlayProps> = async context => {
    const [
        account,
        challengesRaw,
    ] = await Promise.all([
        getAccount(context),
        getAllChallenges()
    ]);

    const challenges = sortBy(challengesRaw.filter(chall => chall.visible))
        .map(chall => chall.clientSideMetadata);

    
    const props = {
        metadata: await getCompetition(),
        challenges,
        account,
    };
    return { props };
};

export default Play;
