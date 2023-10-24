import { CachedChall } from 'cache/challs';
import { CachedSolveMeta } from 'cache/solves';

import React, { useState } from 'react';

import ActionModal from '../../ActionModal';
import ChallActionBar from './ChallActionBar';
import ChallInfoBar from './ChallInfoBar';
import DeployStatus from './DeployStatus';
import ChallMetaEditor from '../ChallMetaEditor';

export interface ChallViewProps {
    challenge: CachedChall;
    solves: CachedSolveMeta[];
}



const ChallView: React.FC<ChallViewProps> = ({ challenge, solves }) => {
    const [[modalAction, actionName, doubleConfirmed], setModalAction] = useState<[null | (() => Promise<unknown>), string, boolean]>([null, "", false]);
    const [editingChallMetadata, setEditingChallMetadata] = useState(false); 

    return <>
        <div className="grid grid-flow-col grid-cols-2,1 grid-rows-2 row p-4 rounded-lg bg-slate-800 gap-y-4">
            <div className="text-2xl font-mono">
                {challenge.clientSideMetadata.name}
                {" "}
                (<span className="font-mono bg-slate-900 px-2 py-0.5 rounded-md border-2 border-slate-700">{`${String(challenge.id).slice(0, 8)}`}</span>)
            </div>
            <ChallInfoBar challenge={challenge} solves={solves} />
            <ChallActionBar challenge={challenge} setModalAction={setModalAction} initEditChallMetadataModal={() => setEditingChallMetadata(true)}/>
            <DeployStatus challenge={challenge} solves={solves}/>
        </div>

        <ActionModal actionName={actionName} modalAction={modalAction} clearAction={() => setModalAction([null, "", false])} doubleConfirm={doubleConfirmed}/>
        {editingChallMetadata && <ChallMetaEditor challenge={challenge} solves={solves} exitChallMetaEditor={() => setEditingChallMetadata(false)} />}
    </>;
};

export default ChallView;
