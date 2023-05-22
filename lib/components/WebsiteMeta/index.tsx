import Head from "next/head";
import React, { FC } from "react";
import { Competition } from "metadata/client";

export interface WebsiteHeaderProps {
    metadata: Competition;
    pageName: string;
}

/**
 * Sets all of the `<head>` properties on the webpage, when provided with
 * competition, env, and page metadata.
 * 
 * @param {WebsiteHeaderProps} props
 * @returns {JSX} The WebsiteMeta JSX representation
 */
const WebsiteMeta: FC<WebsiteHeaderProps> = ({ metadata, pageName }) => {
    const title = `${pageName} | ${metadata.name}`;
    return <Head>
        <title>{title}</title>
        <link rel="icon" href={metadata.logoUrl} />
    </Head>
};

export default WebsiteMeta;