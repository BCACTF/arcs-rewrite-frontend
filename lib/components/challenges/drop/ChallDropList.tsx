// Components
import ChallDrop, { ChallDropProps } from "./parts/ChallDrop";


// Hooks


// Types

import React, { FC } from "react"


// Styles


// Utils


export interface ChallDropListProps {
    cards: ChallDropProps[];
}

const ChallDropList: FC<ChallDropListProps> = ({ cards }) => (
    <ul
        aria-label="challenge list"
        className="
            flex flex-col
            items-center justify-start
            w-screen/2 min-w-60 max-w-100
            gap-y-4">
        {cards.map((card, idx) => <ChallDrop {...card} key={idx}/>)}
    </ul>
);

export default ChallDropList;
