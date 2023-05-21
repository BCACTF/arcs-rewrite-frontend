// Components
import WebsiteMeta from "components/WebsiteMeta";
import TeamList from "components/leaderboard/TeamList";

// Hooks

// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { CompetitionMetadata } from 'metadata/general';
import { Environment } from 'metadata/env';
import { CachedTeamMeta } from "cache/teams";

// Styles

// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount, { Account } from "account/validation";
import { getAllTeams, sortBy as sortTeamsBy } from "cache/teams";
import HeaderBanner, { HeaderBannerPage } from "components/HeaderBanner";

interface TeamPageProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    teams: CachedTeamMeta[];
    account: Account | null;
}

const Home: FC<TeamPageProps> = ({ compMeta, envData, teams, account }) => {
    return (
        <div className="flex flex-col">
            <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>
            <HeaderBanner account={account} meta={compMeta} currPage={HeaderBannerPage.LEAD} />
            <TeamList teams={teams}/>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<TeamPageProps> = async context => {
    const account = await getAccount(context);
    
    const teams = sortTeamsBy(await getAllTeams()).reverse();

    const props: TeamPageProps = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        account,
        teams,
    };
    return { props };
};

export default Home;
