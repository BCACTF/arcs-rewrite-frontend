// Components
import WebsiteMeta from "components/WebsiteMeta";
import WebsiteCountdown from "components/WebsiteCountdown";
import NoSsr from "components/NoSsr/NoSsr";
import HeaderBanner from "components/HeaderBanner";

// Hooks
import useAccount from "hooks/useAccount";

// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { CompetitionMetadata } from 'metadata/general';
import { Environment } from 'metadata/env';

// Styles
// import rawStyles from 'Home.module.scss';
// import { wrapCamelCase } from "utils/styles/camelcase";
// const [styles, builder] = wrapCamelCase(rawStyles);

// Utils
import { getCompetitionMetadata } from "metadata/general";
import { getEnvironment } from "metadata/env";
import getAccount, { Account } from "account/validation";
import { ClientSideMeta as ClientSideMetaUsers, getUsers } from "cache/users";
import { UserId, userIdFromStr } from "cache/ids";
import UserCard from "components/users/UserCard";
import { CachedTeamMeta, getTeams } from "cache/teams";

interface UserPageProps {
    compMeta: CompetitionMetadata;
    envData: Environment;
    user: ClientSideMetaUsers;
    userId: UserId;
    account: Account | null;
    userImgHref: string | null;
    team: CachedTeamMeta | null;
}

const UserPage: FC<UserPageProps> = ({ compMeta, envData, user, team, userImgHref, account }) => {
    return (
        <div className="flex flex-col items-center justify-center pt-16 h-screen">
            <WebsiteMeta compMeta={compMeta} envConfig={envData} pageName="Home"/>
            <HeaderBanner account={account} meta={compMeta} currPage={null}/>
            <UserCard {...{user, team, userImgHref, isMe: account?.userId === user.userId}}/>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<UserPageProps> = async context => {
    const account = await getAccount(context);

    const userIdRaw = context.query.userid?.toString() ?? "";
    const userId = userIdFromStr(userIdRaw);
    if (!userId) throw new Error("Bad UserID!");

    const user = await getUsers([userId]).then(arr => arr[0]);
    if (!user) throw new Error("Uh this person doesn't exist sorry");

    const team = user.teamId ? await getTeams([user.teamId]).then(teams => teams[0] ?? null) : null;

    const props: UserPageProps = {
        envData: getEnvironment(),
        compMeta: getCompetitionMetadata(),
        userId,
        user: user.clientSideMetadata,
        team,
        userImgHref: account?.img ?? null,
        account,
    };
    return { props };
};

export default UserPage;
