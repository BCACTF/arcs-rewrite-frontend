// Components
import WebsiteMeta from "components/WebsiteMeta";
import WebsiteCountdown from "components/WebsiteCountdown";
import NoSsr from "components/NoSsr/NoSsr";
import HeaderBanner, { HeaderBannerPage } from "components/HeaderBanner";

// Hooks


// Types
import React, { FC } from 'react';
import { Competition } from 'metadata/client';

// Styles


// Utils
import getCompetition from "metadata/client";
import getAccount, { Account } from "account/validation";
import { wrapServerSideProps, pageLogger } from "logging";

interface HomeProps {
    metadata: Competition;
    account: Account | null;
}

const Home: FC<HomeProps> = ({ metadata, account }) => {
    return (
        <div className="flex flex-col place-content-evenly h-screen">
            <HeaderBanner account={account} meta={metadata} currPage={HeaderBannerPage.HOME}/>
            <div className="sm:pb-20 sm:my-auto max-sm:mb-auto grid place-content-center grid-cols-none">
                <WebsiteMeta metadata={metadata} pageName="Home"/>
                <NoSsr>
                    <WebsiteCountdown
                        metadata={metadata}
                        formatter={({days, hours, minutes, seconds}) => <div className={""}>{"T-"} {days}{"d"} {hours}{"h "}{minutes}{"m "}{seconds}{"s "}</div>} />
                </NoSsr>
            </div>
        </div>
    )
}

export const getServerSideProps = wrapServerSideProps<HomeProps>(async function HomeSSP(context) {
    pageLogger.info`Recieved request for ${context.resolvedUrl}`;

    const props: HomeProps = {
        metadata: await getCompetition(),
        account: await getAccount(context),
    };
    return { props };
});

export default Home;
