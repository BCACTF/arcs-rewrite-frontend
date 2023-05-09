// Components
import Link from "next/link";
import TextInput from "components/inputs/TextInput";
import CheckboxInput from "components/inputs/CheckboxInput";
import Divider from "components/inputs/Divider";
import UsernameIssue from "components/inputs/UsernameIssue";
import WebsiteMeta from "components/WebsiteMeta";

// Hooks
import useUsernameValidation from "hooks/useUsernameValidation";

// Types
import { GetServerSideProps } from "next";
import { FC } from "react"
import { Environment } from "metadata/env";
import { CompetitionMetadata } from "metadata/general";

// Utils
import { getToken } from "next-auth/jwt";
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";


interface RegisterPageProps {
    envData: Environment;
    compMeta: CompetitionMetadata;
}

// Use/display the props, especially the competition metadata
const RegisterPage: FC<RegisterPageProps> = ({ envData, compMeta }) => {
    const [issue, usernameStatus, updateUsername] = useUsernameValidation();
    
    return <div className="h-screen w-screen flex place-content-center px-3 align-middle justify-center">
        <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Play"/>

        <div className="
            w-80 xl:w-[30rem]
            bg-signin-background-color bg-opacity-50
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
                <CheckboxInput id="eligible-checkbox">
                    I am <Link href="/rules" className="font-bold underline text-main-color-300">
                        eligible
                    </Link> for prizes in this competition.
                </CheckboxInput>
                <TextInput promptName="Affiliation" spellCheck="false"/>
                <Divider/>
                <CheckboxInput id="rules-checkbox">
                    I have read and agree to the <Link href="/rules" className="font-bold underline text-main-color-300">
                        rules
                    </Link> of this competition.
                </CheckboxInput>

            </div>
        </div>
    </div>;
};

export const getServerSideProps: GetServerSideProps<RegisterPageProps> = async context => {
    const token = await getToken(context);

    if (!token) return { notFound: true, redirect: "/" };

    const props: RegisterPageProps = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
    };
    return { props };
};

export default RegisterPage;
