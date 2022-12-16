// Components


// Hooks


// Types
import { GetServerSideProps } from "next";
import { FC } from "react"
import { CompetitionMetadata } from "metadata/general";
import { Environment } from "metadata/env";
import { AccountState } from "account/types";

// Styles


// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount from "account/validation";


interface LoginProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    account: AccountState;
}


const Login: FC<LoginProps> = (props) => {
    return <></>
};

export const getServerSideProps: GetServerSideProps<LoginProps> = async context => {
    const props: {
        envData: Environment,
        compMeta: CompetitionMetadata,
        account: AccountState,
    } = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        account: getAccount(context),
    };
    return { props };
};

export default Login;
