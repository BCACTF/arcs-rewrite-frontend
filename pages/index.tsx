// Components
import WebsiteMeta from "components/WebsiteMeta";
import WebsiteCountdown from "components/WebsiteCountdown";
import NoSsr from "components/NoSsr/NoSsr";
import HeaderBanner, { HeaderBannerPage } from "components/HeaderBanner";

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

interface HomeProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    account: Account | null;
}

const Home: FC<HomeProps> = ({ compMeta, envData, account }) => {
    return (
        <div className="flex flex-col place-content-evenly h-screen">
            <HeaderBanner account={account} meta={compMeta} currPage={HeaderBannerPage.HOME}/>
            <div className="sm:pb-20 sm:my-auto max-sm:mb-auto grid place-content-center">
                <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>
                <NoSsr>
                    <WebsiteCountdown
                        compMeta={compMeta}
                        envConfig={envData}
                        formatter={({days, hours, minutes, seconds}) => <div className={""}>{"T+"} {days}{"d"} {hours}{"h "}{minutes}{"m "}{seconds}{"s "}</div>} />
                </NoSsr>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async context => {
    const props: HomeProps = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        account: await getAccount(context),
    };
    return { props };
};

export default Home;
