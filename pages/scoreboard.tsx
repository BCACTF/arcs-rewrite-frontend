// Components
import WebsiteMeta from "components/WebsiteMeta";
import TeamList from "components/leaderboard/TeamList";

// Hooks

// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { Competition } from 'metadata/client';
import { CachedTeamMeta } from "cache/teams";

// Styles

// Utils
import getCompetition from "metadata/client";
import getAccount, { Account } from "account/validation";
import { getAllTeams, sortBy as sortTeamsBy } from "cache/teams";
import HeaderBanner, { HeaderBannerPage } from "components/HeaderBanner";

interface TeamPageProps {
    metadata: Competition;
    teams: CachedTeamMeta[];
    account: Account | null;
}

const Home: FC<TeamPageProps> = ({ metadata, teams, account }) => {
    return (
        <div className="flex flex-col">
            <WebsiteMeta metadata={metadata} pageName="Home"/>
            <HeaderBanner account={account} meta={metadata} currPage={HeaderBannerPage.LEAD} />
            <TeamList teams={teams}/>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<TeamPageProps> = async context => {
    const account = await getAccount(context);
    
    const teams = sortTeamsBy(await getAllTeams()).reverse();

    const props: TeamPageProps = {
        metadata: await getCompetition(),
        account,
        teams,
    };
    return { props };
};

export default Home;
