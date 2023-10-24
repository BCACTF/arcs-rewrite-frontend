// Components
import WebsiteMeta from "components/WebsiteMeta";
import HeaderBanner, { HeaderBannerPage } from "components/HeaderBanner";

// Hooks


// Types
import React, { FC } from 'react';
import { Competition } from 'metadata/client';

import { CachedSolveMeta } from "cache/solves";
import { CachedUser } from "cache/users";
import { CachedTeamMeta } from "cache/teams";
import { CachedChall } from "cache/challs";

import { UserId } from "cache/ids";


// Styles


// Utils
import getCompetition from "metadata/client";
import getAccount, { Account } from "account/validation";
import { wrapServerSideProps, pageLogger } from "logging";

interface AdminPanelProps {
    metadata: Competition;
    account: Account;

    teams: CachedTeamMeta[];
    users: CachedUser[];
    solves: CachedSolveMeta[];
    challenges: CachedChall[];

    teamUserMap: Record<string, UserId[]>;
    teamSolveMap: Record<string, CachedSolveMeta[]>;
    userSolveMap: Record<string, CachedSolveMeta[]>;
    challSolveMap: Record<string, CachedSolveMeta[]>;
}

const AdminPanel: FC<AdminPanelProps> = ({
    metadata, account,
    teams, users, solves, challenges,
    teamUserMap, teamSolveMap, userSolveMap, challSolveMap,
}) => {
    return (
        <div className="flex flex-col h-screen">
            <HeaderBanner account={account} meta={metadata} currPage={HeaderBannerPage.HOME}/>
            <div className="sm:pb-20 sm:my-auto max-sm:mb-auto inline-flex justify-center align-middle">
                
                <WebsiteMeta metadata={metadata} pageName="Home"/>
                <AdminChallengeManager challenges={challenges} challSolveMap={challSolveMap} />
            </div>
        </div>
    )
}

import { getAllUsers } from "cache/users";
import { getAllChallenges } from "cache/challs";
import { getAllSolves } from "cache/solves";
import { getAllTeams } from "cache/teams";

import { challIdToStr, teamIdToStr, userIdToStr } from "cache/ids";
import AdminChallengeManager from "components/admin/AdminChallengeManager";

export const getServerSideProps = wrapServerSideProps<AdminPanelProps>(async function AdminPanelSSP(context) {
    const account = await getAccount(context);
    if (!account || !account.admin) {
        pageLogger.secWarn`User (${account?.userId}) attempted to access admin page without admin privileges.`
        return { redirect: { destination: '/', permanent: false } };
    }
    
    pageLogger.info`Recieved request for ${context.resolvedUrl}`;

    const [teams, users, allSolves, challenges] = await Promise.all([
        getAllTeams(),
        getAllUsers(),
        getAllSolves(),
        getAllChallenges()
    ]);

    const solves = allSolves;
    // pageLogger.debug`${ allSolves }`

    // pageLogger.info`${challenges.map(chall => [chall.id, chall.clientSideMetadata.name, chall.clientSideMetadata.solveCount])}`;

    pageLogger.info`Finished fetching data for ${context.resolvedUrl}`;

    const teamUserMap: Record<string, UserId[]> = {};

    const teamSolveMap: Record<string, CachedSolveMeta[]> = {};
    const userSolveMap: Record<string, CachedSolveMeta[]> = {};
    const challSolveMap: Record<string, CachedSolveMeta[]> = {};

    for (const team of teams) {
        teamUserMap[teamIdToStr(team.id)] = [];
        teamSolveMap[teamIdToStr(team.id)] = [];
    }
    for (const chall of challenges) {
        challSolveMap[challIdToStr(chall.id)] = [];
    }
    
    for (const user of users) {
        userSolveMap[userIdToStr(user.userId)] = [];

        if (user.teamId) {
            teamUserMap[teamIdToStr(user.teamId)]?.push(user.userId);
        }
    }

    for (const solve of solves) {
        const teamId = teamIdToStr(solve.teamId);
        const challId = challIdToStr(solve.challId);
        const userId = userIdToStr(solve.userId);

        teamSolveMap[teamId]?.push(solve);
        challSolveMap[challId]?.push(solve);
        userSolveMap[userId]?.push(solve);
    }


    // pageLogger.debug`${challSolveMap}`;


    const props: AdminPanelProps = {
        metadata: await getCompetition(),
        account: account,

        teams,
        users,
        solves,
        challenges,

        teamUserMap,
        teamSolveMap,
        userSolveMap,
        challSolveMap,
    };
    return { props };
});

export default AdminPanel;
