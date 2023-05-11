// Components
import WebsiteMeta from 'components/WebsiteMeta';
import OAuthLoginBlock from 'components/OAuthLoginBlock';
import Link from "next/link";

// Hooks


// Types
import React, { FC, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { CompetitionMetadata } from 'metadata/general';
import { Environment } from 'metadata/env';

// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount, { Account } from "account/validation";
import Router from 'next/router';
import { getProviders } from 'next-auth/react';
import { JWT, getToken } from 'next-auth/jwt';



interface SignInProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    account: Account | null;
    token: JWT | null;
    providers: Exclude<Awaited<ReturnType<typeof getProviders>>, null>;
}


const SignIn: FC<SignInProps> = ({ providers, account, token, envData, compMeta }) => {

    useEffect(
        () => {
            if (account) Router.replace("/");
            else if (token) Router.replace("/account/new-user");
        },
        [account, token],
    );

    const [google, github] = [providers.google, providers.github];

    return (
        <div className="h-screen w-screen flex place-content-center px-3 align-middle justify-center">
            <div className="w-80 xl:w-[30rem] bg-signin-background-color border border-signin-text border-opacity-20 bg-opacity-50 px-1 pt-8 pb-4 align-center justify-center my-auto rounded-lg mx-auto"> 
                <h3 className="text-4xl text-signin-text-header text-center mx-auto pb-12">
                        Sign In
                </h3>
                <div className="flex flex-col space-y-8 place-content-center">
                    <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Sign In"/>
                    {
                        github && <OAuthLoginBlock
                            iconLink={"/icons/github.png"}

                            providerName='Github'
                            provider={github} />
                    }
                    {
                        google && <OAuthLoginBlock
                            iconLink={"/icons/google.png"}

                            providerName='Google'
                            provider={google} />
                    }
                    {/* <EmailPasswordSignIn>
                        
                    </EmailPasswordSignIn> */}
                </div>
                <div className="text-center m-auto pt-8 text-lg">
                    <Link href={"/"} className="w-1/4 px-3 py-1 m-auto bg-signin-light bg-opacity-70 transition hover:text-signin-text-header cursor-pointer rounded-lg hover:bg-signin-provider-hover-color" >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<SignInProps> = async context => {
    const providers = await getProviders();
    
    if (!providers) return { notFound: true };
    const account = await getAccount(context);
    const token = await getToken(context);



    const props: SignInProps = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        account,
        token,
        providers,
    };

    return { props };
};

export default SignIn;
