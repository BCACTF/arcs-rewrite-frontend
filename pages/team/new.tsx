// Components
import WebsiteMeta from "components/WebsiteMeta";

// Hooks

// Types
import React, { FC, useState } from 'react';
import { GetServerSideProps } from 'next';
import { CompetitionMetadata } from 'metadata/general';
import { Environment } from 'metadata/env';


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
    const [passwordsInputted, setPasswordsInputted] = useState(false);

    const recalcError = () => {
        const orig = document.querySelector<HTMLInputElement>("#teampass")?.value ?? "";
        const confirm = document.querySelector<HTMLInputElement>("#teampassconfirm")?.value ?? "";
        
        (orig.length > 0 || confirm.length > 0) ? setPasswordsInputted(true) : setPasswordsInputted(false);

        if (confirm === "" || orig === "") { setError(true); return; }
        if (orig && confirm && orig !== confirm) setError(true);
        else setError(false)
    };

    const submitInformation = () => {
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
    };

    const baseInput = "h-12 md:h-14 mx-3 w-11/12                            \
                       py-2 px-2 border rounded-lg \
                       transition delay-[10ms] bg-signin-background-color";

    return (
        <div className="h-screen w-screen flex place-content-center px-3 align-middle justify-center">
            <div className="flex flex-col w-[26rem] md-w-[28rem] xl-w-[30rem] text-center
                            border border-signin-text border-opacity-20 rounded-lg
                            bg-signin-background-color bg-opacity-50  
                            justify-center align-center m-auto px-3 pt-8 pb-4">
                <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>
                <HeaderBanner account={account} meta={compMeta} currPage={null} />
                <h2 className="font-bold text-3xl mb-2">Create New Team</h2>
                <div className="mb-3">
                {
                    (error && passwordsInputted) ? (
                        <h2 className="text-red-500">Mismatched Passwords</h2>
                    ) : (
                        <br></br>
                    )
                }
                </div>
                <div className="flex flex-col space-y-3 place-content-center">
                    <div className="flex flex-row place-content-around">
                        <div className="m-auto">
                            <label>Team Name</label>
                        </div>
                        <div>
                            <input id="teamname" type="text" className={`${baseInput} border-signin-provider-outline`}/>
                        </div>
                    </div>
                    <hr className="w-4/5 mx-auto opacity-20"></hr>
                    <div className="flex flex-row place-content-around">
                        <div className="m-auto">
                            <label>Team Password</label>
                        </div>
                        <div>
                            <input onInput={recalcError} id="teampass" type="password" className={`${baseInput} ${passwordsInputted ? (error ? "border-red-500" : "border-green-400") : "border-signin-provider-outline"}`}/>
                        </div>
                    </div>
                    <div className="flex flex-row place-content-around">
                        <div className="m-auto ">
                            <label>Confirm Password</label>
                        </div>
                        <div>
                            <input onInput={recalcError} id="teampassconfirm" type="password" className={`${baseInput} ${passwordsInputted ? (error ? "border-red-500" : "border-green-400") : "border-signin-provider-outline"}`}/>
                        </div>
                    </div>
                    <hr className="w-4/5 mx-auto opacity-20"></hr>
                    <div aria-disabled={!account?.eligible} className="group aria-disabled:cursor-not-allowed flex flex-row place-content-around">
                        <div className="m-auto">
                            <label className=" group-aria-disabled:text-gray-400 group-aria-disabled:cursor-not-allowed">Team Affiliation:</label>
                        </div>
                        <div>
                            <input disabled={!account?.eligible} id="teamaffiliation" type="text" className={`disabled:saturate-50 group-aria-disabled:cursor-not-allowed ${baseInput} border-signin-provider-outline`}/>
                        </div>
                    </div>
                </div>
                <button onClick={submitInformation} className="w-32 h-10 mt-4 mx-auto text-center rounded-md bg-signin-light bg-opacity-70 transition hover:text-signin-text-header cursor-pointer hover:bg-signin-provider-hover-color">Submit</button>
            </div>
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
