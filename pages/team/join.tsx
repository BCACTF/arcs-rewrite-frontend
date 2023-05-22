// Components
import TextInput from "components/inputs/TextInput";
import CheckboxInput from "components/inputs/CheckboxInput";
import Divider from "components/inputs/Divider";
import WebsiteMeta from "components/WebsiteMeta";

// Hooks
import { useState, useCallback } from "react";
import { useRouter } from "next/router";

// Types
import { GetServerSideProps } from "next";
import { FC } from "react"
import { Competition } from "metadata/client";

// Utils
import getCompetition from "metadata/client";
import getAccount from "account/validation";


interface JoinTeamPageProps {
    metadata: Competition
}

// Use/display the props, especially the competition metadata
const JoinTeamPage: FC<JoinTeamPageProps> = ({ metadata }) => {
    const router = useRouter();


    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    
    const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);

    const sendJoinTeamRequest = useCallback(
        async () => {
            if (!disclaimerAgreed) return;
            const options = {
                method: "POST",
                body: JSON.stringify({
                    name,
                    password,
                }),
            };
            const response = await fetch("/api/account/join-team", options);

            if (response.ok) router.push("/");
            else {
                console.error(response);
                alert("Error joining team!");
            }
        },
        [name, password, router],
    );
    const cancelJoining = useCallback(
        async () => {
            router.back();
        },
        [router],
    );
    
    return <div className="h-screen w-screen flex place-content-center px-3 align-middle justify-center">
        <WebsiteMeta metadata={metadata} pageName="Play"/>

        <div className="
            w-4/5 max-w-30 xl:max-w-[30rem]
            bg-signin-background-color bg-opacity-50
            border border-signin-text border-opacity-20 rounded-lg
            px-1 py-12 my-auto mx-auto
            align-center justify-center"> 
            <h3 className="text-3xl text-signin-text text-center mx-auto pb-10 font-bold">
                Join Team
            </h3>
            <div className="flex flex-col items-center space-y-8 place-content-center">
                <span className="text-lg text-signin-text text-center mx-auto pb-5 px-2">
                    You'll need the team name and password. Ask the person who created your team for that information.
                </span>
                

                <TextInput
                    promptName="Team Name"
                    spellCheck="false"
                    value={name}
                    onChange={ev => setName(ev.currentTarget.value)}
                    additionalClassName="pr-12" />
                <Divider/>
                <TextInput
                    promptName="Team Password"
                    spellCheck="false"
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}/>
                <Divider/>
                <CheckboxInput
                    id="rules-checkbox"
                    checked={disclaimerAgreed}
                    onChange={event => setDisclaimerAgreed(event.target.checked)}>
                    I understand that once I join this team,
                    I cannot leave this team or switch teams for the purpose of sharing flags
                    or other challenge information.
                </CheckboxInput>

                <button
                    onClick={sendJoinTeamRequest}
                    disabled={!disclaimerAgreed}
                    className="
                        h-12 md:h-14 w-screen-2/5 sm:w-1/2 pb-0.5
                        text-lg font-medium
                        flex justify-center items-center
                        border-2 border-main-color-500 bg-main-color-700 rounded-lg
                        disabled:saturate-50 saturate-100 transition-[filter] duration-300
                        px-5">Join Team</button>

                <button
                    onClick={cancelJoining}
                    className="
                        h-12 md:h-14 w-screen-2/5 sm:w-1/2 pb-0.5
                        text-lg font-medium
                        flex justify-center items-center
                        bg-user-profile-no-team-background-color rounded-lg
                        px-5">Cancel</button>
            </div>
        </div>
    </div>;
};

export const getServerSideProps: GetServerSideProps<JoinTeamPageProps> = async context => {
    const account = await getAccount(context);

    if (!account) return { notFound: true, redirect: "/" };


    const props: JoinTeamPageProps = {
        metadata: await getCompetition(),
    };
    return { props };
};

export default JoinTeamPage;
