// Components
import Link from "next/link";
import TextInput from "components/inputs/TextInput";
import CheckboxInput from "components/inputs/CheckboxInput";
import Divider from "components/inputs/Divider";
import UsernameIssue from "components/inputs/UsernameIssue";
import WebsiteMeta from "components/WebsiteMeta";

// Hooks
import useUsernameValidation from "hooks/useUsernameValidation";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";

// Types
import { GetServerSideProps } from "next";
import { FC } from "react"
import { Competition } from "metadata/client";

// Utils
import getCompetition from "metadata/client";
import { getTokenSecret } from "api/auth/[...nextauth]";
import { signOut } from "next-auth/react";


interface RegisterPageProps {
    metadata: Competition;
}

// Use/display the props, especially the competition metadata
const RegisterPage: FC<RegisterPageProps> = ({ metadata }) => {
    const router = useRouter();


    const [username, issue, usernameStatus, updateUsername] = useUsernameValidation();
    const [eligible, setEligible] = useState(false);
    const [affiliationValue, setAffiliationValue] = useState("");
    const [rulesAgreed, setRulesAgreed] = useState(false);




    const sendCreateUserRequest = useCallback(
        async () => {
            if (!rulesAgreed) return;
            const options = {
                method: "POST",
                body: JSON.stringify({
                    username,
                    eligible,
                    affiliation: affiliationValue,
                }),
            };
            const response = await fetch("/api/account/create-user", options);

            if (response.ok) router.push("/");
            else {
                console.error(response);
                alert("Error creating user!");
            }
        },
        [username, eligible, affiliationValue, rulesAgreed, router],
    );
    const cancelRegistration = useCallback(
        async () => {
            await signOut({ redirect: false });
            router.push("/");
        },
        [router],
    );
    
    return <div className="h-screen w-screen flex place-content-center px-3 align-middle justify-center">
        <WebsiteMeta metadata={metadata} pageName="Play"/>

        <div className="
            w-80 xl:w-[30rem]
            bg-signin-background-color
            border border-signin-text border-opacity-20 rounded-lg
            px-1 py-12 my-auto mx-auto
            align-center justify-center"> 
            <h3 className="text-3xl text-signin-text text-center mx-auto pb-10 font-bold">
                    Finish Registration
            </h3>
            <div className="flex flex-col items-center space-y-8 place-content-center">
                <span className="text-lg text-signin-text text-center mx-auto pb-5">
                    Just a few more things until your account is set up...
                </span>
                

                <TextInput
                    promptName="Username"
                    verificationState={usernameStatus}
                    spellCheck="false"
                    onChangeCapture={ev => {
                        updateUsername(ev.currentTarget.value);
                        ev.preventDefault();
                        ev.stopPropagation();
                    }}
                    additionalClassName="pr-12" />
                <UsernameIssue issue={issue}/>
                <Divider/>
                <CheckboxInput
                    id="eligible-checkbox"
                    checked={eligible}
                    onChange={event => setEligible(event.target.checked)}>
                    I am <Link href="/rules" className="font-bold underline text-main-color-300">
                        eligible
                    </Link> for prizes in this competition.
                </CheckboxInput>
                <TextInput
                    promptName="Affiliation"
                    spellCheck="false"
                    value={affiliationValue}
                    onChange={event => setAffiliationValue(event.target.value)}/>
                <Divider/>
                <CheckboxInput
                    id="rules-checkbox"
                    checked={rulesAgreed}
                    onChange={event => setRulesAgreed(event.target.checked)}>
                    I have read and agree to the <Link href="/rules" className="font-bold underline text-main-color-300">
                        rules
                    </Link> of this competition.
                </CheckboxInput>

                <button
                    onClick={sendCreateUserRequest}
                    disabled={!rulesAgreed || usernameStatus !== "success"}
                    className="
                        disabled:bg-signin-button-ifthethingisdisabledshowthis-background-color disabled:cursor-default
                        h-12 md:h-14 w-screen-2/5 sm:w-1/2 pb-0.5
                        text-lg font-medium
                        flex justify-center items-center
                        border-[1px]
                        border-border-signin-button-border-color
                        text-signin-button-text-color
                        hover:bg-signin-provider-hover-color
                        bg-signin-button-background-color rounded-lg
                        px-5">Create Account</button>

                <button
                    onClick={cancelRegistration}
                    className="
                        h-12 md:h-14 w-screen-2/5 sm:w-1/2 pb-0.5
                        text-lg font-medium
                        flex justify-center items-center
                        border-[1px]
                        border-border-signin-button-border-color
                        text-signin-button-text-color
                        hover:bg-signin-provider-hover-color
                        bg-signin-button-background-color
                         rounded-lg
                        px-5">Cancel</button>
            </div>
        </div>
    </div>;
};

export const getServerSideProps: GetServerSideProps<RegisterPageProps> = async context => {
    const token = await getTokenSecret(context);

    if (!token) return { notFound: true, redirect: "/" };

    const props: RegisterPageProps = {
        metadata: await getCompetition(),
    };
    return { props };
};

export default RegisterPage;
