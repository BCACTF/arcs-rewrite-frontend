// Components


// Hooks


// Types

import React, { FC } from "react"


// Styles
import rawStyles from './ChallengeCard.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import { ClientSideMeta } from "cache/challs";
const [styles, builder] = wrapCamelCase(rawStyles);


// Utils


export interface SolvedState {
    byUser: boolean;
    byTeam: boolean;
}
export interface ChallengeCardProps {
    metadata: ClientSideMeta;
    solved: SolvedState;
}

const SolvedIcon = ({ byUser, byTeam }: SolvedState) => {
    if (byUser) return <></>;
    else if (byTeam) return <></>;
    else return <></>;
}

const ChallengeCard: FC<ChallengeCardProps> = ({ metadata: { name, solveCount, categories, points }, solved }) => (
    <li aria-label="challenge card" className={styles.card}>
        <h3 className={styles.title}>{name}</h3>
        
        <small className={styles.points}>{points} pts.</small>
        <small aria-label="category" className={styles.category}>{categories}</small>

        <SolvedIcon {...solved} />
        
        
        <small className={styles.solves}>
            {solveCount.toLocaleString('en-US', {maximumFractionDigits: 0})} solves
        </small>
    </li>
);

export default ChallengeCard;
