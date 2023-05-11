// Components
import Collapsible from "react-collapsible";
import ChallDropHeader from "./ChallDropHeader";
import ChallDropBody from "./ChallDropBody";

// Hooks
import { useCallback, useState } from "react";

// Types
import React, { FC } from "react";
import { ClientSideMeta } from "cache/challs";
import { ChallId, TeamId, UserId } from "cache/ids";

// Styles

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

    const tailwindClasses = `
        w-full
        transition-shadow ease-linear
        shadow-[0_0_0px_0px_rgba(113,165,217,0.0)] hover:shadow-[0_0_8px_8px_rgba(113,165,217,0.2)]`;

    return (
        <Collapsible
            triggerElementProps={{id: `${props.metadata.id}-dropdown-trigger`}}
            contentElementId={`${props.metadata.id}-dropdown-props`}

            trigger={<ChallDropHeader {...props} open={open}/>}
            onOpening={setOpen} onClosing={setClosed}
            transitionTime={200}
            openedClassName={tailwindClasses}
            className={tailwindClasses}>
            <ChallDropBody {...props} open={open} />
        </Collapsible>
    )
};

export default ChallDrop;
