// Components


// Hooks


// Types

import { FC } from "react"


// Styles
import rawStyles from './ChallDropList.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import ChallDrop, { ChallDropProps } from "./parts/ChallDrop";
import { ReactSVG } from "react-svg";
const [styles, builder] = wrapCamelCase(rawStyles);


// Utils


export interface ChallDropListProps {
    cards: ChallDropProps[];
}

const ChallDropList: FC<ChallDropListProps> = ({ cards }) => (
    <ul aria-label="challenge list" className={styles.list}>
        {cards.map((card, idx) => <ChallDrop {...card} key={idx}/>)}
    </ul>
);

export default ChallDropList;
