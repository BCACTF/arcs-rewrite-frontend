// Components
import Link from "next/link";
import TextInput from "components/inputs/TextInput";
import CheckboxInput from "components/inputs/CheckboxInput";
import Divider from "components/inputs/Divider";

// Hooks
import useDuplicateCheck from "hooks/useDuplicateCheck";

// Types
import { GetServerSideProps } from "next";
import { FC } from "react"
import { Environment } from "metadata/env";
import { CompetitionMetadata } from "metadata/general";


// Styles


// Utils
import { JWT, getToken } from "next-auth/jwt";
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import "lib/utils/username";
import useUsernameValidation from "hooks/useUsernameValidation";
import UsernameIssue from "components/inputs/UsernameIssue";


interface RegisterPageProps {
    envData: Environment;
    compMeta: CompetitionMetadata;
    token: JWT;
}


const RegisterPage: FC<RegisterPageProps> = (props) => {
    const [issue, usernameStatus, updateUsername] = useUsernameValidation();
    
    return <div className="h-screen w-screen flex place-content-center px-3 align-middle justify-center">
        <div className="w-80 xl:w-[30rem] bg-signin-background-color border border-signin-text border-opacity-20 bg-opacity-50 px-1 py-12 align-center justify-center my-auto rounded-lg mx-auto"> 
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
                <TextInput promptName="Affiliation"/>
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
        token,
    };
    return { props };
};

export default RegisterPage;
