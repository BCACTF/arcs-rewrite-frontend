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
import { CompetitionMetadata, getCompetitionMetadata } from "metadata/general";
import { Environment } from "metadata/env";
import { ClientSideMeta as ClientSideMetaChalls } from "cache/challs";
import { Account } from "account/validation";

// Styles


// Utilities
import { getEnvironment } from "metadata/env";
import { getAllChallenges, sortBy } from "cache/challs";
import getAccount from "account/validation";


interface PlayProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    challenges: ClientSideMetaChalls[];
    account: Account | null;
}

const Play: FC<PlayProps> = ({ compMeta, envData, challenges, account }) => {
    const filterState = useFilter();

    return <div className="flex flex-col items-center justify-start w-screen h-screen min-h-60 pt-20">
        <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Play"/>

        <HeaderBanner account={account} meta={compMeta} currPage={HeaderBannerPage.PLAY} />

        <div className="flex flex-row h-min gap-x-4">
            <FilterView filterState={filterState} challs={challenges}/>

            <ChallDropList cards={challenges.filter(chall => filterState.matches(chall)).map(chall => ({metadata: chall, solved: { byTeam: false, byUser: false }}))}/>
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
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        challenges,
        account,
    };
    return { props };
};

export default Play;
