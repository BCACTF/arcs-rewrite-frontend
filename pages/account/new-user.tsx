// Components
import Router from "next/router";
import WebsiteMeta from 'components/WebsiteMeta';
import HeaderBanner from 'components/HeaderBanner';

// Hooks


// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { Competition } from "metadata/client";
import { JWT } from "next-auth/jwt";

// Styles


// Utils
import getCompetition from "metadata/client";
import { signOut } from 'next-auth/react';
import { getTokenSecret } from 'pages/api/auth/[...nextauth]';


interface NewUserPageProps {
    metadata: Competition;
    token: JWT;
}

const NewUserPage: FC<NewUserPageProps> = ({ metadata }) => {
    const baseInput = "w-48 h-12 bg-slate-800 border-2 border-slate-700 rounded-lg p-3 mr-12";
    
    return (
        <div className="flex flex-col items-center justify-center pt-16 h-screen">
            <WebsiteMeta metadata={metadata} pageName="Home"/>
            <HeaderBanner account={null} meta={metadata} currPage={null} />
            <h2 className="font-bold text-3xl mb-9">Create New User</h2>
            <span>
                <label className="pr-4 inline-block w-48 text-right">Username:</label>
                <input id="username" type="text" className={baseInput}/>
            </span>
            <br/>
            <span>
                <button onClick={() => {
                    const name = document.querySelector<HTMLInputElement>("#username")?.value;
                    fetch(
                        "/api/new-user",
                        {
                            method: "POST",
                            body: JSON.stringify({ name }),
                        },
                    ).then(() => Router.push("/account/settings"))
                }} className="w-32 h-16 text-center rounded-md bg-slate-700 m-3">Submit</button>
                <button onClick={() => signOut({ redirect: true, callbackUrl: "/" })} className="w-32 h-16 text-center rounded-md bg-red-900 m-3">Cancel</button>
            </span>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<NewUserPageProps> = async context => {
    const token = await getTokenSecret(context);

    if (!token) return { notFound: true, redirect: "/" };

    const props: NewUserPageProps = {
        metadata: await getCompetition(),
        token,
    };
    return { props };
};

export default NewUserPage;
