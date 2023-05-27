// Components
import WebsiteMeta from "components/WebsiteMeta";
import HeaderBanner from "components/HeaderBanner";
import TeamInfo from "components/teams/TeamInfo";
import UserList from "components/teams/UserList";
import SolveList from "components/teams/SolveList";

// Hooks

// Types
import React, { FC } from 'react';
import { GetServerSidePropsResult } from 'next';
import { Competition } from 'metadata/client';
import { CachedTeamMeta } from "cache/teams";
import { ClientSideMeta as ClientSideMetaUser } from "cache/users";
import { CachedSolveMeta } from "cache/solves";
import { ClientSideMeta as ClientSideMetaChall } from "cache/challs";


// Utils
import getCompetition from "metadata/client";
import getAccount, { Account } from "account/validation";
import { getTeams } from "cache/teams";
import { getUsersByTeam, sortBy as sortUsersBy } from "cache/users";
import { teamIdFromStr } from "cache/ids";
import { getSolves } from "cache/solves";
import { sortBy as sortSolvesBy } from "cache/solves";
import { getAllChallenges } from "cache/challs";
import { pageLogger, wrapServerSideProps } from "logging";

interface TeamPageProps {
    metadata: Competition;
    team: CachedTeamMeta;
    users: ClientSideMetaUser[];
    solves: CachedSolveMeta[];
    challs: ClientSideMetaChall[];
    account: Account | null;
}

const Home: FC<TeamPageProps> = ({ metadata, team, users, solves, challs, account }) => {
    return (
        <div className="flex flex-col h-screen">
            <HeaderBanner account={account} meta={metadata} currPage={null} />
            <div className="w-full">
                <WebsiteMeta metadata={metadata} pageName="Home"/>

                <TeamInfo team={team}/>
                <hr className="sm:hidden border-b-team-line-color w-3/4 mx-auto "></hr>
                <div className="flex flex-col sm:flex-row place-content-evenly max-sm:w-4/5 mx-auto pt-4 sm:mb-4">
                    <span className="sm:hidden text-center text-lg font-bold pb-2">Team Members</span>
                    <UserList users={users}/>
                    <span className="sm:hidden text-center text-lg font-bold pb-3">Solves</span>
                    <SolveList {...{ users, team, solves, challs }} />
                </div>

            </div>
        </div>
    )
}

export const getServerSideProps = wrapServerSideProps(async (context): Promise<GetServerSidePropsResult<TeamPageProps>> => {
    pageLogger.info`Recieved request for ${context.resolvedUrl}`;

    const account = await getAccount(context);
    
    const teamIdRaw = context.query.teamid?.toString() ?? "";
    const teamId = teamIdFromStr(teamIdRaw);
    if (!teamId) return { notFound: true } as const;

    const team = await getTeams([teamId]).then(team => team[0]);
    if (!teamId) return { notFound: true } as const;

    pageLogger.info`Uuid ${teamId} identified as ${team.name}`;

    const users = sortUsersBy(await getUsersByTeam(teamId));
    const solves = sortSolvesBy(await getSolves(teamId)).reverse();
    const challs = await getAllChallenges();


    const props: TeamPageProps = {
        metadata: await getCompetition(),
        team,
        users: users.map(user => user.clientSideMetadata),
        solves,
        challs: challs.map(c => c.clientSideMetadata),
        account,
    } as const;

    pageLogger.info`Props built for ${team.name} request`;
    return { props };
});

export default Home;
