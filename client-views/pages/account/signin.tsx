// Components
import WebsiteMeta from 'components/WebsiteMeta';
import OAuthLoginBlock from 'components/OAuthLoginBlock';

// Hooks


// Types
import { FC, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { CompetitionMetadata } from 'metadata/general';
import { Environment } from 'metadata/env';
import { AccountState } from "account/types";

// Styles
import rawStyles from 'SignIn.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
const [styles] = wrapCamelCase(rawStyles);

// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount from "account/validation";
import Router from 'next/router';
import { getProviders } from 'next-auth/react';



interface SignInProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    account: AccountState;
    providers: Exclude<Awaited<ReturnType<typeof getProviders>>, null>;
}


const SignIn: FC<SignInProps> = ({ providers, account, envData, compMeta }) => {

    useEffect(
        () => { account.loggedIn && Router.replace("/"); },
        [account],
    );

    const [google, github] = [providers.google, providers.github];

    return (
        <div className={styles.outerContainer}>
            <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Sign In"/>

            <div className={styles.innerContainer}>
                {
                    github && <OAuthLoginBlock
                        color={"#f5f5f5"}
                        background={"#000000"}
                        iconLink={"/icons/github.png"}

                        providerName='Github'
                        provider={github} />
                }
                {
                    google && <OAuthLoginBlock
                        color={"#f5f5f5"}
                        background={"#1562e6"}
                        iconLink={"/icons/google.png"}

                        providerName='Google'
                        provider={google} />
                }
                {/* <EmailPasswordSignIn>
                    
                </EmailPasswordSignIn> */}
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<SignInProps> = async context => {
    const providers = await getProviders();
    if (!providers) return { notFound: true };

    const props: SignInProps = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        account: await getAccount(context),
        providers,
    };

    return { props };
};

export default SignIn;
