import { Environment } from "metadata/env";
import Head from "next/head";
import React, { FC } from "react";
import { CompetitionMetadata } from "metadata/general"

export interface WebsiteHeaderProps {
    compMeta: CompetitionMetadata;
    envConfig: Environment;
    pageName: string;
}

/**
 * Sets all of the `<head>` properties on the webpage, when provided with
 * competition, env, and page metadata.
 * 
 * @param {WebsiteHeaderProps} props
 * @returns {JSX} The WebsiteMeta JSX representation
 */
const WebsiteMeta: FC<WebsiteHeaderProps> = ({ compMeta, envConfig, pageName }) => {
    const title = `${pageName} | ${compMeta.name}`;
    return <Head>
        <title>{title}</title>
        <link rel="icon" href={envConfig.fileLocations.favicon} />
    </Head>
};

export default WebsiteMeta;