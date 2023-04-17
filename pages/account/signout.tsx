// Components


// Hooks


// Types

import React, { FC } from "react"


// Styles


// Utils
import { signOut } from "next-auth/react";
import Router from "next/router";

const SignOut: FC = () => {
    signOut({ redirect: false })
        .then(() => Router.replace("/"));
    return <></>;
};

export default SignOut;
