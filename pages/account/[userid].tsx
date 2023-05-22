// Components
import WebsiteMeta from "components/WebsiteMeta";
import HeaderBanner from "components/HeaderBanner";

// Hooks


// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { Competition } from 'metadata/client';

// Utils
import getCompetition from "metadata/client";
import getAccount, { Account } from "account/validation";
import { ClientSideMeta as ClientSideMetaUsers, getUsers } from "cache/users";
import { UserId, userIdFromStr } from "cache/ids";
import UserCard from "components/users/UserCard";
import { CachedTeamMeta, getTeams } from "cache/teams";

interface UserPageProps {
    metadata: Competition;
    user: ClientSideMetaUsers;
    userId: UserId;
    account: Account | null;
    userImgHref: string | null;
    team: CachedTeamMeta | null;
}

const UserPage: FC<UserPageProps> = ({ metadata, user, team, userImgHref, account }) => {
    return (
        <div className="flex flex-col place-content-evenly h-screen">
            <HeaderBanner account={account} meta={metadata} currPage={null}/>
            <div className="m-auto pb-20">
                <WebsiteMeta metadata={metadata} pageName="Home"/>
                <UserCard {...{user, team, userImgHref, isMe: account?.userId === user.userId}}/>
            </div>
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
        metadata: await getCompetition(),
        userId,
        user: user.clientSideMetadata,
        team,
        userImgHref: account?.img ?? null,
        account,
    };
    return { props };
};

export default UserPage;
