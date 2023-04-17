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
        <div className={"pt-16"}>
            <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>
            <HeaderBanner account={account} meta={compMeta} currPage={HeaderBannerPage.HOME}/>
            <NoSsr>
                <WebsiteCountdown
                    compMeta={compMeta}
                    envConfig={envData}
                    style={{fontSize: "4rem"}}
                    className={{ numbers: "yellow" }}
                    formatter={({days, hours, minutes, seconds}) => <div className={""}>{"T+"} {days}{"d"} {hours}{":"}{minutes}{":"}{seconds}</div>} />
            </NoSsr>
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
