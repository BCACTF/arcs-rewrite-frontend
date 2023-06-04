// Components
import TextInput from "components/inputs/TextInput";
import CheckboxInput from "components/inputs/CheckboxInput";
import Divider from "components/inputs/Divider";
import WebsiteMeta from "components/WebsiteMeta";
import Link from "next/link";

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
import { validatePassword } from "database";


interface NewTeamPageProps {
    metadata: Competition;
    canBeEligible: boolean;
}

// Use/display the props, especially the competition metadata
const NewTeamPage: FC<NewTeamPageProps> = ({ metadata, canBeEligible }) => {
    const router = useRouter();


    const [name, setName] = useState("");

    const [eligible, setEligible] = useState(false);
    const [affiliation, setAffiliation] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmMatches, setConfirmMatches] = useState<boolean>(false);


    const [passwordAgreement, setPasswordAgreement] = useState(true);


    const sendCreateTeamRequest = useCallback(
        async () => {
            if (!passwordAgreement) return;
            const options = {
                method: "POST",
                body: JSON.stringify({
                    name,
                    eligible,
                    affiliation,
                    password,
                }),
            };
            const response = await fetch("/api/account/new-team", options);

            if (response.ok) router.push("/");
            else {
                console.error(response);
                alert("Error joining team!");
            }
        },
        [name, eligible, affiliation, password, confirmPassword, router],
    );
    const cancelCreating = useCallback(
        async () => {
            router.back();
        },
        [router],
    );

    const updatePasswordError = useCallback(() => {
        const passwordIssues = validatePassword(password);
        console.log(passwordIssues);
        const passwordError = passwordIssues.ok ? null : passwordIssues.issue;
        setPasswordError(passwordError);
        setConfirmMatches(true);
    }, [password, confirmPassword, setPasswordError, setConfirmMatches]);

    
    return (
    <div className="h-screen flex w-full place-content-center align-middle justify-center">
        <div className="flex place-content-center px-3 my-5">
            <WebsiteMeta metadata={metadata} pageName="Play"/>

            <div className="
                sm:w-3/5 
                bg-signin-background-color bg-opacity-50
                border border-signin-text border-opacity-20 rounded-lg
                px-1 py-6 mx-auto my-auto
                align-center justify-center"> 
                <h3 className="text-3xl text-signin-text text-center mx-auto pb-10 font-bold">
                    Create Team
                </h3>
                <div className="flex flex-col items-center space-y-8 place-content-center">
                    <span className="text-lg text-signin-text text-center mx-auto pb-5 px-2 w-2/3">
                        Enter the team's information. Remember that an eligible team has to have ONLY eligible members.
                    </span>
                    

                    <TextInput
                        promptName="Name"
                        spellCheck="false"
                        value={name}
                        onChange={ev => setName(ev.currentTarget.value)}
                        additionalClassName="pr-12" />

                    <Divider/>
                    
                    <TextInput
                        promptName="Affiliation"
                        spellCheck="false"
                        value={affiliation}
                        onChange={event => setAffiliation(event.target.value)}/>

                    <Divider/>

                    {confirmMatches || <span className="text-red-500">Passwords do not match</span>}
                    <span className="text-red-500">{passwordError}</span>
                    
                    <TextInput
                        promptName="Password"
                        spellCheck="false"
                        type="password"
                        value={password}
                        onBlur={updatePasswordError}
                        onChange={event => setPassword(event.target.value)}/>
                    

                    <TextInput
                        promptName="Confirm Password"
                        spellCheck="false"
                        type="password"
                        value={confirmPassword}
                        onBlur={() => setConfirmMatches(confirmPassword === password)}
                        onChange={event => setConfirmPassword(event.target.value)}/>

                    <Divider/>
                    
                    <CheckboxInput
                        id="rules-agreement-checkbox"
                        checked={passwordAgreement}
                        onChange={() => setPasswordAgreement(agreed => !agreed)}>
                        I understand that I MUST save this team password.
                        It cannot be changed, and the CTF admins can't give it to you in case you lose it.
                    </CheckboxInput>

                    <CheckboxInput
                        id="eligible-checkbox"
                        checked={eligible}
                        disabled={!canBeEligible}
                        onChange={() => setEligible(eligible => !eligible)}>
                        This team is <Link href="/rules" className="font-bold underline text-main-color-300">
                            eligible
                        </Link> for prizes in this competition.
                    </CheckboxInput>

                    <button
                        onClick={sendCreateTeamRequest}
                        disabled={!passwordAgreement || password !== confirmPassword || !!passwordError}
                        className="
                            h-12 md:h-14 w-screen-2/5 sm:w-1/2 pb-0.5
                            text-lg font-medium
                            flex justify-center items-center
                            border-2 border-main-color-500 bg-main-color-700 rounded-lg
                            disabled:saturate-50 saturate-100 transition-[filter] duration-300
                            px-5">Create Team</button>

                    <button
                        onClick={cancelCreating}
                        className="
                            h-12 md:h-14 pb-0.5 w-1/2
                            text-lg font-medium
                            flex justify-center items-center
                            bg-user-profile-no-team-background-color rounded-lg
                            px-5">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    );
};

export const getServerSideProps: GetServerSideProps<NewTeamPageProps> = async context => {
    const account = await getAccount(context);

    if (!account) return { notFound: true, redirect: "/" };


    const props: NewTeamPageProps = {
        metadata: await getCompetition(),
        canBeEligible: account.eligible,
    };
    return { props };
};

export default NewTeamPage;
