// Components


// Hooks


// Types

import Link from "next/link";
import { FC } from "react"


// Styles
import rawStyles from './SignInButton.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
const [styles, builder] = wrapCamelCase(rawStyles);

// Utils



const SignInButton: FC = () => (
    <Link href={"/account/signin"} className={styles.flexContainer}>Sign In</Link>
);

export default SignInButton;
