import React, { useState } from 'react';
import useUndeployedChallenges from 'hooks/admin/useUndeployedChallenges';
import ActionModal from '../ActionModal';


interface DeployButtonProps {
    name: string;
    setModalAction: (action: [() => Promise<unknown>, string]) => void;
}

const deployChallenge = async (name: string) => {
    const res = await fetch(`/api/admin/initiate-deploy`, { method: "POST", body: JSON.stringify({ name }) });
    if (!res.ok) {
        console.log(res);
    }
    try {
        const deploymentId = await res.json();
        alert(`See poll id ${deploymentId}`);
    } catch (e) {
        console.error(e);
        alert("Invalid poll ID from API");
    }
}

const DeployAllButton: React.FC<DeployButtonProps> = ({ setModalAction }) => {
    return (
        <button
            onClick={() => setModalAction([async () => { alert("unimplemented") }, "deploy ALL undeployed challenges"])}
            className="
                py-2 h-fit overflow-x-scroll
                bg-slate-900
                col-span-2
                border-4 border-slate-300 rounded-lg">
            All
        </button>
    );
};

const DeployButton: React.FC<DeployButtonProps> = ({ name, setModalAction }) => {
    return (
        <button
            onClick={() => setModalAction([async () => { deployChallenge(name) }, `deploy challenge \`${name}\``])}
            className="
                py-2 h-fit overflow-x-scroll
                bg-slate-900
                border-4 border-slate-300 rounded-lg">
            {name}
        </button>
    );
};

const ChallengeDeployer: React.FC = () => {
    const [undeployedChallenges, refreshData] = useUndeployedChallenges();
    const [[modalAction, actionName], setModalAction] = useState<[null | (() => Promise<unknown>), string]>([null, ""]);

    return  <>
        {actionName && modalAction && <ActionModal
            actionName={actionName}
            modalAction={modalAction}
            clearAction={() => setModalAction([null, ""])}/>}
        
        <div className="
            grid grid-cols-8 grid-flow-row gap-x-6 gap-y-2
            p-4 h-40 overflow-y-scroll
            bg-sky-800 rounded-lg ">
            <div className="text-2xl w-max h-min">Deploy:</div>
            <DeployAllButton name={""} setModalAction={setModalAction}/>
            {undeployedChallenges.map(chall => <DeployButton name={chall} setModalAction={setModalAction}/>)}
        </div>
    </>;
};

export default ChallengeDeployer;

