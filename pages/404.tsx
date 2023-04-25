// Components
import WebsiteMeta from "components/WebsiteMeta";
import FloatingEasterEgg from "components/FloatingEasterEgg";
import Link from "next/link";

// Hooks
import useStorage from "hooks/useStorage";

// Types
import { GetStaticProps } from "next";
import React, { FC } from "react";
import { CompetitionMetadata } from "metadata/general";
import { Environment } from "metadata/env";

// Styles
// import rawStyles from '404.module.scss';
// import { wrapCamelCase } from "utils/styles/camelcase";
// const [styles, builder] = wrapCamelCase(rawStyles);

// Utilities
import { getEnvironment } from "metadata/env";
import { safeRandomFlagChars } from "utils/random";


interface Err404Props {
    compMeta: CompetitionMetadata;
    envData: Environment;
}

const Err404: FC<Err404Props> = ({ compMeta, envData }) => {
    const [randomL] = useStorage("/404 | randomL", () => safeRandomFlagChars(10));
    const [randomR] = useStorage("/404 | randomR", () => safeRandomFlagChars(10));
    
    
    return <div className="h-screen w-screen grid place-content-center text-center text-404-text-color">
        <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="404"/>

        <h1 className="text-8xl font-extrabold m-2 pb-1 text-404-text-color-header">404</h1>
        <h3 className="text-3xl border-b-2 border-white mb-2 pb-3 font-semibold">Page Not Found</h3>
        <div className="text-xl">
        </div>

        <h2 className="text-2xl font-light pb-3 mb-3 border-b-[1px] border-white">Suggested Redirects</h2>
        
        <div className="flex flex-row place-content-between text-center mb-2 divide-x ">
            <Link href={"/"} className="flex-grow hover:text-404-text-color-alternate transition delay-[15ms]">Home</Link>
            <Link href={"/play"} className="flex-grow hover:text-404-text-color-alternate">Play</Link>
        </div>

        <FloatingEasterEgg>
            <div style={{padding: "1rem"}}>
                Have a randomly generated flag for your troubles: {" "}
                <code className="">{`bcactf{${randomL}-n0t-4-r3a1-f1ag-l0l-${randomR}"}`}</code>
            </div>
        </FloatingEasterEgg>
    </div>
}

export const getStaticProps: GetStaticProps<Err404Props> = async () => {
    const props = {
        envData: getEnvironment(),
        compMeta: {name: "BCACTF 4.0", start: 0, end: 1670533082},
    };
    return { props };
};

export default Err404;
