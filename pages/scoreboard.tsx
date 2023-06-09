// Components
import WebsiteMeta from "components/WebsiteMeta";
import TeamList from "components/leaderboard/TeamList";
import HeaderBanner, { HeaderBannerPage } from "components/HeaderBanner";

// Hooks

// Types
import React, { FC } from 'react';
import { Competition } from 'metadata/client';
import { CachedTeamMeta } from "cache/teams";
import { Account } from "account/validation";

// Styles

// Utils
import getCompetition from "metadata/client";
import getAccount from "account/validation";
import { getAllTeams, sortBy as sortTeamsBy } from "cache/teams";
import { pageLogger, wrapServerSideProps } from "logging";

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

export const getServerSideProps = wrapServerSideProps<TeamPageProps>(async function ScoreBoardSSP(context) {
    pageLogger.info`Recieved request for ${context.resolvedUrl}`;

    const account = await getAccount(context);
    
    const teams = sortTeamsBy(await getAllTeams()).reverse();

    const props: TeamPageProps = {
        metadata: await getCompetition(),
        account,
        teams,
    };
    return { props };
});

export default Home;
