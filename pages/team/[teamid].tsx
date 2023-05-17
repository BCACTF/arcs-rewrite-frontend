// Components
import WebsiteMeta from "components/WebsiteMeta";

// Hooks

// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { CompetitionMetadata } from 'metadata/general';
import { Environment } from 'metadata/env';
import { CachedTeamMeta } from "cache/teams";
import { ClientSideMeta as ClientSideMetaUser } from "cache/users";
import { CachedSolveMeta, sortBy as sortSolvesBy } from "cache/solves";


// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount, { Account } from "account/validation";
import { getTeams } from "cache/teams";
import { getUsersByTeam, sortBy as sortUsersBy } from "cache/users";
import { teamIdFromStr } from "cache/ids";
import { getSolves } from "cache/solves";
import TeamInfo from "components/teams/TeamInfo";
import UserList from "components/teams/UserList";
import SolveList from "components/teams/SolveList";
import { ClientSideMeta as ClientSideMetaChall, getAllChallenges } from "cache/challs";
import HeaderBanner from "components/HeaderBanner";

interface TeamPageProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    team: CachedTeamMeta;
    users: ClientSideMetaUser[];
    solves: CachedSolveMeta[];
    challs: ClientSideMetaChall[];
    account: Account | null;
}

const Home: FC<TeamPageProps> = ({ compMeta, envData, team, users, solves, challs, account }) => {
    return (
        <div className="flex flex-row pt-16">
            <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>
            <HeaderBanner account={account} meta={compMeta} currPage={null} />

            <div className="flex flex-col border-r-2 border-slate-700">
                <TeamInfo team={team}/>
                <UserList users={users}/>
            </div>

            <SolveList {...{ users, team, solves, challs }} />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<TeamPageProps> = async context => {
    const account = await getAccount(context);
    
    const teamIdRaw = context.query.teamid?.toString() ?? "";
    const teamId = teamIdFromStr(teamIdRaw);
    if (!teamId) throw new Error("istg this is just an MVP thx bye");

    const team = await getTeams([teamId]).then(team => team[0]);
    if (!team) throw new Error("istg this is just an MVP thx bye");

    const users = sortUsersBy(await getUsersByTeam(teamId));

    const solves = sortSolvesBy(await getSolves(teamId)).reverse();

    const challs = await getAllChallenges();

    console.log(team);

    const props: TeamPageProps = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        team,
        users: users.map(user => user.clientSideMetadata),
        solves,
        challs: challs.map(c => c.clientSideMetadata),
        account,
    };
    return { props };
};

export default Home;
