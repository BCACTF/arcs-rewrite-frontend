// Components
import WebsiteMeta from "components/WebsiteMeta";
import WebsiteCountdown from "components/WebsiteCountdown";
import NoSsr from "components/NoSsr/NoSsr";
import HeaderBanner from "components/HeaderBanner";

// Hooks

// Types
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { CompetitionMetadata } from 'metadata/general';
import { Environment } from 'metadata/env';
import { AccountState } from "account/types";

// Styles
import rawStyles from 'Home.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
const [styles, builder] = wrapCamelCase(rawStyles);

// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount from "account/validation";

interface HomeProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    account: AccountState;
}

const Home: FC<HomeProps> = ({ compMeta, envData, account }) => {
    return (
        <div className={styles.container}>
            <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>

            <HeaderBanner account={account} meta={compMeta} />

            <NoSsr>
                <WebsiteCountdown
                    compMeta={compMeta}
                    envConfig={envData}
                    style={{fontSize: "4rem"}}
                    className={{ numbers: styles.yellow }}
                    // formatters={{
                    //     numbers: {
                    //         d: n => `${n}`.padStart(2, " "),
                    //         h: n => `${n}`.padStart(2, " "),
                    //         m: n => `${n}`.padStart(2, " "),
                    //         s: n => `${n}`.padStart(2, " "),
                    //     }
                    // }}
                    formatter={({days, hours, minutes, seconds}) => <div className={styles.yellow}>{"T+"} {days}{"d"} {hours}{":"}{minutes}{":"}{seconds}</div>} />
            </NoSsr>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async context => {
    const props: {
        envData: Environment,
        compMeta: CompetitionMetadata,
        account: AccountState,
    } = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        account: getAccount(context),
    };
    return { props };
};

export default Home;
