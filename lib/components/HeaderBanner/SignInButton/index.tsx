// Components
import Link from "next/link";


// Hooks


// Types
import React, { FC } from "react"


// Styles

// Utils



const SignInButton: FC = () => (
    <Link href={"/account/signin"} className="
        flex flex-row justify-center items-center
        h-9 w-60
        rounded-2xl bg-signin-light">
        Sign In
    </Link>
);

export default SignInButton;
