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
            max-sm:mx-auto
            sm:w-[88%]
            mt-1
            gap-y-4 h-[85vh] pb-4 max-h-[100%] overflow-y-scroll overflow-x-clip bg-clip-border">
        {cards.map((card, idx) => <ChallDrop {...card} key={idx}/>)}
    </ul>
);

export default ChallDropList;
