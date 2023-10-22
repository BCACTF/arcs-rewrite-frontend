import { CachedChall } from 'cache/challs';
import { challIdToStr } from 'cache/ids';
import { CachedSolveMeta } from 'cache/solves';

import React, { useState } from 'react';
import ChallView from './ChallView';
import DropdownHeader from '../DropdownHeader';
import DropdownBody from '../DropdownBody';

interface AdminChallengeManagerProps {
    challenges: CachedChall[];
    challSolveMap: Record<string, CachedSolveMeta[]>;
}

const AdminChallengeManager: React.FC<AdminChallengeManagerProps> = ({ challenges, challSolveMap }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex flex-col w-full max-sm:mx-20 mx-32 lg:mx-40">
            <DropdownHeader collapsed={collapsed} setCollapsed={setCollapsed} children="Manage Challenges" />
            <DropdownBody collapsed={collapsed} extraPx={32}>
                {challenges.map(chall => (
                    <ChallView challenge={chall} key={String(chall.id)} solves={challSolveMap[challIdToStr(chall.id)]}/>
                ))}
            </DropdownBody>
        </div>
    );
};

export default AdminChallengeManager;

