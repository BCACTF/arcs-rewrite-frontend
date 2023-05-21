// Components
import Link from "next/link";

// Types
import React, { FC } from "react"

const SignInButton: FC = () => (
    <>
        <div>
            {/* mobile */}
            <Link href={"/account/signin"} className="
                sm:hidden
                flex flex-row justify-center items-center text-center ml-auto mt-1
                h-8 w-1/4
                rounded-2xl bg-navbar-account-dropdown-background-color
                text-navbar-account-dropdown-text-color">
                Sign In
            </Link>

            {/* not mobile */}
            <Link href={"/account/signin"} className="
                max-sm:hidden
                flex flex-row justify-center items-center
                h-9 w-60 transition delay-[5ms]
                rounded-2xl bg-navbar-account-dropdown-background-color hover:bg-navbar-account-dropdown-background-color-hover
                text-navbar-account-dropdown-text-color">
                Sign In
            </Link>
        </div>
    </>
);

export default SignInButton;
