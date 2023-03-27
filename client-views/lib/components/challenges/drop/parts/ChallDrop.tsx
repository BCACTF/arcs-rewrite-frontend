// Components
import Collapsible from "react-collapsible";

// Hooks


// Types

import { FC, useCallback, useState } from "react"


// Styles
import rawStyles from './ChallDrop.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import { ClientSideMeta } from "cache/challs";
import { ReactSVG } from "react-svg";
import ChallDropHeader from "./ChallDropHeader";
import ChallDropBody from "./ChallDropBody";
const [styles, builder] = wrapCamelCase(rawStyles);


// Utils


export interface SolvedState {
    byUser: boolean;
    byTeam: boolean;
}
export interface ChallDropProps {
    metadata: ClientSideMeta;
    solved: SolvedState;
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
