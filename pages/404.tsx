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
import rawStyles from '404.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
const [styles, builder] = wrapCamelCase(rawStyles);

// Utilities
import { getEnvironment } from "metadata/env";
import { safeRandomChars, safeRandomFlagChars } from "utils/random";


interface Err404Props {
    compMeta: CompetitionMetadata;
    envData: Environment;
}

const Err404: FC<Err404Props> = ({ compMeta, envData }) => {
    const [randomL] = useStorage("/404 | randomL", () => safeRandomFlagChars(10));
    const [randomR] = useStorage("/404 | randomR", () => safeRandomFlagChars(10));
    
    
    return <div className={styles.container}>
        <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="404"/>

        <h1 className={styles.textBanner}>404</h1>

        <p className={styles.quote}>{"This isn't the page you're looking for."}</p>
        <p className={styles.quote}>{"You can go about your business."}</p>
        <p className={styles.quote}>{"Move along."}</p>

        <br/>

        <h2>Where do I even go from here?</h2>
        <div className={styles.directory}>
            <Link href={"/"}>Home</Link>
            <Link href={"/login"}>Login</Link>
            <Link href={"/challs"}>Challenges</Link>
        </div>

        <FloatingEasterEgg>
            <div style={{padding: "1rem"}}>
                Have a randomly generated flag for your troubles: {" "}
                <code className={styles.codeBlock}>{`bcactf{${randomL}-n0t-4-r3a1-f1ag-l0l-${randomR}"}`}</code>
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
