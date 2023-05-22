// Components
import WebsiteMeta from "components/WebsiteMeta";
import HeaderBanner from "components/HeaderBanner";

// Hooks


// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { Competition } from 'metadata/client';

// Styles


// Utils
import getCompetition from "metadata/client";
import getAccount, { Account } from "account/validation";
import { CachedTeamMeta, getTeams } from "cache/teams";

interface SettingsPageProps {
    metadata: Competition;
    account: Account;
    team: CachedTeamMeta | null;
}

const UserPage: FC<SettingsPageProps> = ({ metadata, account }) => {
    return (
        <div className="flex flex-col place-content-evenly h-screen">
            <HeaderBanner account={account} meta={metadata} currPage={null} />
            <div className="flex flex-col items-center my-auto">
                <WebsiteMeta metadata={metadata} pageName="Home"/>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<SettingsPageProps> = async context => {
    const account = await getAccount(context);


    if (!account) return { notFound: true, redirect: { destination: "/account/signin" } };

    const team = account.teamId ? await getTeams([account.teamId]).then(teams => teams[0] ?? null) : null;


    const props: SettingsPageProps = {
        metadata: await getCompetition(),
        account,
        team,
    };
    return { props };
};

export default UserPage;
