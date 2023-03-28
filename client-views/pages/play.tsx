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
import { ClientSideMeta, getAllChallenges, sortBy } from "cache/challs";
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

        <div className="flex flex-row h-min gap-x-4">
            <FilterView filterState={filterState} challs={challenges}/>

            <ChallDropList cards={challenges.filter(chall => filterState.matches(chall)).map(chall => ({metadata: chall, solved: { byTeam: false, byUser: false }}))}/>
        </div>
    </div>
}

export const getServerSideProps: GetStaticProps<PlayProps> = async () => {
    require("utils/setup-test-challs");
    
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
