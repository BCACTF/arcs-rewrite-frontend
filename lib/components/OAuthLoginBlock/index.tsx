// Components
import Image from "next/image";

// Hooks


// Types
import React, { FC } from "react";

// Utils
import { ClientSafeProvider, signIn } from "next-auth/react";


interface OAuthLoginBlockProps {
    providerName: string;
    iconLink: string;

    provider: ClientSafeProvider;
}


const OAuthLoginBlock: FC<OAuthLoginBlockProps> = ({
        provider,
        providerName,
        iconLink, 
}) => (
    <button onClick={() => signIn(provider.id)} className="h-12 md:h-14 mx-5 lg:w-4/5 lg:mx-auto flex flex-row place-content-around py-2 border border-signin-provider-outline rounded-lg transition delay-[10ms] hover:bg-signin-provider-hover-color hover:scale-[101.5%]">
        <div className="h-5/6 w-1/6 relative grid place-content-center sm:px-5 md:px-8 my-auto">
            <Image 
                src={iconLink}
                alt='Provider Icon'
                className="object-contain" 
                fill={true}
                />
        </div>
        <div className="border border-r-[.5px] border-signin-provider-outline h-full"></div>
        <div className="flex flex-row place-content-end m-auto text-lg text-right text-signin-text">
            <span className="my-auto">Sign in with {providerName}</span>
        </div>
    </button>
);

export default OAuthLoginBlock;
