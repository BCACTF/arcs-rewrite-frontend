// Components
import WebsiteMeta from "components/WebsiteMeta";

// Hooks

// Types
import { GetStaticProps } from "next";
import React, { FC } from "react";
import { CompetitionMetadata } from "metadata/general";
import { Environment } from "metadata/env";

// Styles
import rawStyles from 'Play.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
const [styles, builder] = wrapCamelCase(rawStyles);

// Utilities
import { getEnvironment } from "metadata/env";
import { ClientSideMeta, getAllChallenges, sortBy, update } from "cache/challs";
import { challIdFromStr, deployIdFromStr } from "cache/ids";
import ChallDropList from "components/challenges/drop/ChallDropList";
import FilterView from "components/filter-view/FilterView";
import useFilter from "hooks/useFilter";


interface PlayProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    challenges: ClientSideMeta[];
}

const Play: FC<PlayProps> = ({ compMeta, envData, challenges }) => {
    const filterState = useFilter();

    return <div className={styles.container}>
        <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Play"/>

        <div>
            
        </div>
        <FilterView filterState={filterState} challs={challenges}/>

        <ChallDropList cards={challenges.map(chall => ({metadata: chall, solved: { byTeam: false, byUser: false }}))}/>
    </div>
}

export const getServerSideProps: GetStaticProps<PlayProps> = async () => {
    // console.log(await removeStale([]));
    console.log(await update({
        challId: challIdFromStr('ecb8f04a-7e9d-489e-bcb3-65f4f35a27c7')!,
        deploymentUuid: deployIdFromStr('6e04002e-6856-4028-9501-c76904bb075f')!,
        visible: true,
        clientSideMetadata: {
            name: "Real Deal HTML",
            points: 100,
            desc: "I have just made the most ultimate html site. This site, this html. This is truly the real deal.\n\nIt really is.",

            solveCount: 1234,
            categories: ["WebEx"],
            authors: ["me"],
            hints: ["aaaaaaaaa"],
            tags: ["Real Chall", "HTML 🎉"],
            links: [],
        }
    }));
    console.log(await update({
        challId: challIdFromStr('ecb8f04a-7e9d-489e-bcb3-65f4f35a27c8')!,
        deploymentUuid: deployIdFromStr('6e04002e-6856-4028-9501-c76904bb075f')!,
        visible: true,
        clientSideMetadata: {
            name: "Crappy Colonization Corp",
            points: 1000,
            desc: "beel lkajsdlfiajwoem ajksdnfliauwelif!!!",
            solveCount: 999,
            categories: ["Crypto", "Rev"],
            authors: ["skysky"],
            hints: ["Your IGUID is not used as an index into the hashmap. Only the result of the \"proprietary algorithm\" is used."],
            tags: ["IGUID", "Proprietary™", "BCACTF 3.0", "MD5 is secure"],
            links: [],
        }
    }));

    const challenges = sortBy((await getAllChallenges()).filter(chall => chall.visible));
    const props = {
        envData: getEnvironment(),
        compMeta: {name: "BCACTF 4.0", start: 0, end: 1670533082},
        challenges: challenges.map(chall => chall.clientSideMetadata),
    };
    // console.log(challenges);
    return { props };
};

export default Play;
