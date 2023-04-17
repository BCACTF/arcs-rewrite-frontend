// Components
import Collapsible from "react-collapsible";
import ChallDropHeader from "./ChallDropHeader";
import ChallDropBody from "./ChallDropBody";

// Hooks
import { useCallback, useState } from "react";

// Types
import React, { FC } from "react";
import { ClientSideMeta } from "cache/challs";


// Styles
import rawStyles from './ChallDrop.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import { ChallId, TeamId, UserId } from "cache/ids";
const [styles, builder] = wrapCamelCase(rawStyles);


// Utils


export interface SolvedState {
    byUser: boolean;
    byTeam: boolean;
}
export interface ChallDropProps {
    metadata: ClientSideMeta;
    solved: SolvedState;
    submission: { challId: ChallId, teamId: TeamId | null, userId: UserId | null };
}



const ChallDrop: FC<ChallDropProps> = (props) => {
    const [open, setOpenState] = useState(false);
    const setOpen = useCallback(() => setOpenState(true), []);
    const setClosed = useCallback(() => setOpenState(false), []);
    return (
        <Collapsible
            trigger={<ChallDropHeader {...props} open={open}/>}
            onOpening={setOpen} onClosing={setClosed}
            transitionTime={200}
            openedClassName={styles.collapsible}
            className={styles.collapsible}>
            <ChallDropBody {...props} open={open} />
        </Collapsible>
    )
};

export default ChallDrop;
