// Components
import WebsiteMeta from "components/WebsiteMeta";

// Hooks

// Types
import React, { FC, useState } from 'react';
import { GetServerSideProps } from 'next';
import { CompetitionMetadata } from 'metadata/general';
import { Environment } from 'metadata/env';
import { CachedTeamMeta } from "cache/teams";
import { ClientSideMeta as ClientSideMetaUser } from "cache/users";
import { CachedSolveMeta, sortBy as sortSolvesBy } from "cache/solves";

// Styles
// import rawStyles from 'Home.module.scss';
// import { wrapCamelCase } from "utils/styles/camelcase";
// const [styles, builder] = wrapCamelCase(rawStyles);

// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount, { Account } from "account/validation";
import HeaderBanner from "components/HeaderBanner";
import Router from "next/router";

interface NewTeamPageProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    account: Account | null;
}

const NewTeam: FC<NewTeamPageProps> = ({ compMeta, envData, account }) => {
    const [error, setError] = useState(false);

    const recalcError = () => {
        const orig = document.querySelector<HTMLInputElement>("#teampass")?.value ?? "";
        const confirm = document.querySelector<HTMLInputElement>("#teampassconfirm")?.value ?? "";
        if (orig && confirm && orig !== confirm) setError(true);
        else setError(false)
    };
    const baseInput = "w-40 h-12 bg-slate-800 border-2 border-slate-700 rounded-lg p-3";

    return (
        <div className="flex flex-col items-center border-4 border-slate-700 mt-16 p-4">
            <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>
            <HeaderBanner account={account} meta={compMeta} currPage={null} />
            <h2 className="font-bold text-3xl mb-9">Create New Team</h2>
            <span>
                <label className="pr-4 inline-block w-48 text-right">Team Name:</label>
                <input id="teamname" type="text" className={baseInput}/>
            </span>
            <br/>
            <span>
                <label className="pr-4 inline-block w-48 text-right">Team Password:</label>
                <input onChange={recalcError} id="teampass" type="password" className={`${baseInput} ${error && "border-red-900"}`}/>
            </span>
            <span>
                <label className="pr-4 inline-block w-48 text-right">Confirm Password:</label>
                <input onChange={recalcError} id="teampassconfirm" type="password" className={`${baseInput} ${error && "border-red-900"}`}/>
            </span>
            <br/>
            <span aria-disabled={account?.type !== "eligible"} className="group aria-disabled:cursor-not-allowed">
                <label className="pr-4 inline-block w-48 text-right group-aria-disabled:text-gray-400 group-aria-disabled:cursor-not-allowed">Affiliation:</label>
                <input disabled={account?.type !== "eligible"} id="teamaffiliation" type="text" className="w-40 h-12 bg-slate-800 border-2 border-slate-700 rounded-lg p-3 disabled:saturate-50 group-aria-disabled:cursor-not-allowed"/>
            </span>
            <br/>
            <button onClick={() => {
                const name = document.querySelector<HTMLInputElement>("#teamname")?.value ?? "";
                const password = document.querySelector<HTMLInputElement>("#teampass")?.value ?? "";
                const affiliation = document.querySelector<HTMLInputElement>("#teamaffiliation")?.value ?? "";

                if (error) { return; }
                else fetch(
                    "/api/new-team",
                    {
                        method: "POST",
                        body: JSON.stringify({ name, password, affiliation }),
                    },
                ).then(() => Router.push(`/account/${account?.userId ?? "signin"}`))
            }} className="w-32 h-16 text-center rounded-md bg-slate-700">Submit</button>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<NewTeamPageProps> = async context => {
    const account = await getAccount(context);

    const props: NewTeamPageProps = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        account,
    };
    return { props };
};

export default NewTeam;
