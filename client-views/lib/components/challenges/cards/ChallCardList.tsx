// Components


// Hooks


// Types

import React, { FC } from "react"


// Styles
import rawStyles from './ChallCardList.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import ChallengeCard, { ChallengeCardProps } from "./ChallengeCard";
const [styles, builder] = wrapCamelCase(rawStyles);


// Utils


export interface ChallengeListProps {
    cards: ChallengeCardProps[];
}

const ChallengeList: FC<ChallengeListProps> = ({ cards }) => (
    <ul aria-label="challenge list" className={styles.list}>
        {/* {cards.map((card, idx) => <ChallengeCard {...card} key={idx}/>)} */}
        {cards.map((card, idx) => <ChallengeCard {...card} key={idx}/>)}
    </ul>
);

export default ChallengeList;
