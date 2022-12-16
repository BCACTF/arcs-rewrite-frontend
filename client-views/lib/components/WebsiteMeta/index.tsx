import Head from "next/head";
import { FC } from "react";
import { CompetitionMetadata, Environment } from "../../metadata/general"

export interface WebsiteHeaderProps {
    compMeta: CompetitionMetadata;
    envConfig: Environment;
    pageName: string;
}

const WebsiteMeta: FC<WebsiteHeaderProps> = ({ compMeta, envConfig, pageName }) => {
    const title = `${pageName} | ${compMeta.name}`;
    return <Head>
        <title>{title}</title>
        <link rel="icon" href={envConfig.fileLocations.favicon} />
    </Head>
};

export default WebsiteMeta;