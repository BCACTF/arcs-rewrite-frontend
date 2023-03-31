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
import { CachedSolveMeta } from "cache/solves";

// Styles
// import rawStyles from 'Home.module.scss';
// import { wrapCamelCase } from "utils/styles/camelcase";
// const [styles, builder] = wrapCamelCase(rawStyles);

// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount from "account/validation";
import { getTeams } from "cache/teams";
import { getUsersByTeam, sortBy as sortUsersBy } from "cache/users";
import { teamIdFromStr } from "cache/ids";
import { getSolves } from "cache/solves";

interface TeamPageProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    team: CachedTeamMeta;
    users: ClientSideMetaUser[];
    solves: CachedSolveMeta[];
}

const Home: FC<TeamPageProps> = ({ compMeta, envData, team, users }) => {
    return (
        <div className={"boop"}>
            <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>
            {JSON.stringify(team)}
            {JSON.stringify(users)}
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

    const solves = await getSolves(teamId);
    

    const props: TeamPageProps = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        team,
        users: users.map(user => user.clientSideMetadata),
        solves,
    };
    return { props };
};

export default Home;
