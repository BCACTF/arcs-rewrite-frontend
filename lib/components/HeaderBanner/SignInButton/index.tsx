// Components
import Link from "next/link";

// Types
import React, { FC } from "react"

const SignInButton: FC = () => (
    <Link href={"/account/signin"} className="
        flex flex-row justify-center items-center
        h-9 w-60
        rounded-2xl bg-navbar-account-dropdown-background-color
        text-navbar-account-dropdown-text-color">
        Sign In
    </Link>
);

export default SignInButton;
