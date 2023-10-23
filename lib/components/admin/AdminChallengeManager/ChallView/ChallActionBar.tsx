import { CachedChall } from "cache/challs";
import { ChallId } from "cache/ids";

import ActionButton from "../../ActionButton";
import React from "react";

interface ChallActionBarProps {
    challenge: CachedChall;
    setModalAction: (action: [() => Promise<unknown>, string]) => void;
    initEditChallMetadataModal: () => void;
}

const clearChallSolves = async (id: ChallId) => {
    const response = await fetch("/api/admin/chall", { body: JSON.stringify({ clear: true, id }), method: "PUT" });
    if (!response.ok) {
        alert(`Failed to clear solves for ${id}`);
        return false;
    }
    return true;
}

const setChallVis = async (id: ChallId, visible: boolean) => {
    const response = await fetch("/api/admin/chall", { body: JSON.stringify({ visible, id }), method: "PUT" });
    if (!response.ok) {
        alert(`Failed to set challenge visibility to ${visible} for ${id}`);
        return false;
    }
    return true;
};

const resyncChall = async (id: ChallId) => {
    const response = await fetch("/api/admin/chall", { body: JSON.stringify({ resync: true, id }), method: "PUT" });
    if (!response.ok) {
        alert(`Failed to resync challenge ${id}`);
        return false;
    }
    return true;
};

const ChallActionBar: React.FC<ChallActionBarProps> = ({ challenge, setModalAction, initEditChallMetadataModal }) => {
    const visibilityActionName = `set \`${challenge.clientSideMetadata.name}\` ${challenge.visible ? "invisible" : "visible"}`;
    const clearSolveActionName = `clear ALL solves for \`${challenge.clientSideMetadata.name}\``;

    return (
        <div className="grid grid-flow-row grid-cols-4 gap-2">
            <ActionButton
                confirmed={false}
                className="bg-green-900"

                action={() => resyncChall(challenge.id)}
                actionName={""}
                setModalAction={setModalAction}
                children="Resync"/>
            <ActionButton
                confirmed={true}
                className="bg-yellow-700"

                action={() => setChallVis(challenge.id, !challenge.visible)}
                actionName={visibilityActionName}
                setModalAction={setModalAction}
                children={`Set ${challenge.visible ? "invisible" : "visible"}`}/>
            <ActionButton
                confirmed={false}
                className="bg-yellow-700"

                action={async () => initEditChallMetadataModal()}
                actionName={visibilityActionName}
                setModalAction={setModalAction}
                children={`Metadata`}/>
            <ActionButton
                confirmed={true}
                className="bg-red-900"

                action={() => clearChallSolves(challenge.id)}
                actionName={clearSolveActionName}
                setModalAction={setModalAction}
                children="Clear solves"/>
        </div>
    );
};

export default ChallActionBar;
