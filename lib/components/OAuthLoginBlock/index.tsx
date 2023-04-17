// Components
import Image from "next/image";

// Hooks


// Types
import React, { CSSProperties, FC } from "react";


// Styles
import rawStyles from './OAuthLoginBlock.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
const [styles, builder] = wrapCamelCase(rawStyles);

// Utils
import { ClientSafeProvider, signIn } from "next-auth/react";


interface OAuthLoginBlockProps {
    providerName: string;
    iconLink: string;

    provider: ClientSafeProvider;
    // csrfToken: string | undefined;

    color: string;
    background: string;
    imageStyle?: CSSProperties;
}


const OAuthLoginBlock: FC<OAuthLoginBlockProps> = ({
        provider,

        providerName,
        imageStyle, iconLink, 
        color, background,
}) => (
    <button onClick={() => signIn(provider.id)} className={styles.container} style={{ backgroundColor: background, color }}>
        <Image src={iconLink} alt='' className={styles.icon} width={1024} height={1024} style={imageStyle}/>
        <span>Sign in with {providerName}</span>
    </button>

);

export default OAuthLoginBlock;
