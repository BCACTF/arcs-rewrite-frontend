// Components
import WebsiteMeta from "components/WebsiteMeta";
import WebsiteCountdown from "components/WebsiteCountdown";
import NoSsr from "components/NoSsr/NoSsr";
import HeaderBanner from "components/HeaderBanner";

// Hooks
import useAccount from "hooks/useAccount";

// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { CompetitionMetadata } from 'metadata/general';
import { Environment } from 'metadata/env';
import { MyUser, serMyUser, UserState } from "account/types";

// Styles
// import rawStyles from 'Home.module.scss';
// import { wrapCamelCase } from "utils/styles/camelcase";
// const [styles, builder] = wrapCamelCase(rawStyles);

// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount from "account/validation";
import { CachedTeamMeta } from "cache/teams";

interface TeamPageProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    team: CachedTeamMeta;
}

const Home: FC<TeamPageProps> = ({ compMeta, envData, account }) => {

    return (
        <div className={"boop"}>
            <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>
            <HeaderBanner account={account} meta={compMeta} />
            <NoSsr>
                <WebsiteCountdown
                    compMeta={compMeta}
                    envConfig={envData}
                    style={{fontSize: "4rem"}}
                    className={{ numbers: "yellow" }}
                    // formatters={{
                    //     numbers: {
                    //         d: n => `${n}`.padStart(2, " "),
                    //         h: n => `${n}`.padStart(2, " "),
                    //         m: n => `${n}`.padStart(2, " "),
                    //         s: n => `${n}`.padStart(2, " "),
                    //     }
                    // }}
                    formatter={({days, hours, minutes, seconds}) => <div className={""}>{"T+"} {days}{"d"} {hours}{":"}{minutes}{":"}{seconds}</div>} />
            </NoSsr>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<TeamPageProps> = async context => {
    const account = await getAccount(context);
    account?.affiliatedTeam
    const props: {
        envData: Environment,
        compMeta: CompetitionMetadata,
        account: MyUser | null,
    } = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        account: await getAccount(context),
    };
    return { props };
};

export default Home;
