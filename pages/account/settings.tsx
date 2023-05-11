// Components
import WebsiteMeta from "components/WebsiteMeta";
import HeaderBanner from "components/HeaderBanner";

// Hooks


// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { CompetitionMetadata } from 'metadata/general';
import { Environment } from 'metadata/env';

// Styles


// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount, { Account } from "account/validation";
import { CachedTeamMeta, getTeams } from "cache/teams";

interface SettingsPageProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    account: Account;
    team: CachedTeamMeta | null;
}

const UserPage: FC<SettingsPageProps> = ({ compMeta, envData, account }) => {
    return (
        <div className="flex flex-col items-center pt-16">
            <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>
            <HeaderBanner account={account} meta={compMeta} currPage={null} />
            
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<SettingsPageProps> = async context => {
    const account = await getAccount(context);


    if (!account) return { notFound: true, redirect: { destination: "/account/signin" } };

    const team = account.teamId ? await getTeams([account.teamId]).then(teams => teams[0] ?? null) : null;


    const props: SettingsPageProps = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        account,
        team,
    };
    return { props };
};

export default UserPage;
