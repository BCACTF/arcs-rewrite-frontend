// Components
import WebsiteMeta from 'components/WebsiteMeta';
import OAuthLoginBlock from 'components/OAuthLoginBlock';
import Link from "next/link";

// Hooks
import { useEffect, useState } from 'react';


// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { Competition } from 'metadata/client';
import { JWT } from 'next-auth/jwt';
import { Account } from "account/validation";

// Utils
import getCompetition from "metadata/client";
import getAccount from "account/validation";
import Router from 'next/router';
import { getProviders } from 'next-auth/react';
import { getTokenSecret } from 'api/auth/[...nextauth]';



interface SignInProps {
    metadata: Competition;
    account: Account | null;
    token: JWT | null;
    providers: Exclude<Awaited<ReturnType<typeof getProviders>>, null>;
}


const SignIn: FC<SignInProps> = ({ providers, account, token, metadata }) => {
    const [badMethodUsed, setBMU] = useState(false);

    console.log({ account, token });
    useEffect(
        () => {
            if (account) Router.replace("/");
            else if (token) Router.replace("/account/register");
        },
        [account, token],
    );

    useEffect(
        () => setBMU(!!new URLSearchParams(window.location.search).get("methodError")),
        []
    );

    const [google, github] = [providers.google, providers.github];

    return (
        <div className="h-screen w-screen flex place-content-center px-3 align-middle justify-center">
            <div className="w-80 xl:w-[30rem] bg-signin-background-color border border-signin-text border-opacity-20 bg-opacity-50 px-1 pt-8 pb-4 align-center justify-center my-auto rounded-lg mx-auto"> 
                <h3 className="text-4xl text-signin-text-header text-center mx-auto pb-12">
                        Sign In
                </h3>
                <div className="mx-auto mb-5 text-red-400 text-center text-lg" hidden={!badMethodUsed}>
                    Please use your original sign-in method.
                </div>
                <div className="flex flex-col space-y-8 place-content-center">
                    <WebsiteMeta metadata={metadata} pageName="Sign In"/>
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
    const token = await getTokenSecret(context);



    const props: SignInProps = {
        metadata: await getCompetition(),
        account,
        token,
        providers,
    };

    return { props };
};

export default SignIn;
