// Components
import WebsiteMeta from "components/WebsiteMeta";
import HeaderBanner from "components/HeaderBanner";
import UserCard from "components/users/UserCard";

// Hooks


// Types
import React, { FC } from 'react';
import { Competition } from 'metadata/client';
import { Account } from "account/validation";
import { ClientSideMeta as ClientSideMetaUsers } from "cache/users";
import { UserId, fmtLogT, fmtLogU } from "cache/ids";
import { CachedTeamMeta } from "cache/teams";

// Utils
import getCompetition from "metadata/client";
import getAccount from "account/validation";
import { getUsers } from "cache/users";
import { userIdFromStr } from "cache/ids";
import { getTeams } from "cache/teams";
import { pageLogger, wrapServerSideProps } from "logging";

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

export const getServerSideProps = wrapServerSideProps<UserPageProps>(async function UserPageSSP(context) {
    pageLogger.info`Recieved request for ${context.resolvedUrl}`;
    
    const account = await getAccount(context);

    if (account) pageLogger.debug`Req was from ${fmtLogU(account.userId)}`;
    else pageLogger.debug`User making request was not logged in`;

    const userIdRaw = context.query.userid?.toString() ?? "";
    const userId = userIdFromStr(userIdRaw);
    
    if (!userId) {
        pageLogger.warn`Invalid user id: ${userIdRaw}`;
        return { notFound: true };
    }
    
    
    const user = await getUsers([userId]).then(arr => arr[0]);
    if (!user) {
        pageLogger.warn`User ${userId} does not exist`;
        return { notFound: true };
    }

    pageLogger.debug`User ${fmtLogU(userId)} identified as ${user.clientSideMetadata.name}`;
    
    const team = user.teamId ? await getTeams([user.teamId]).then(teams => teams[0] ?? null) : null;
    
    if (team) pageLogger.debug`User ${fmtLogU(userId)} is on team ${team.name} (${fmtLogT(team.id)})`;
    else pageLogger.debug`User ${fmtLogU(userId)} is not on a team`;


    const props: UserPageProps = {
        metadata: await getCompetition(),
        userId,
        user: user.clientSideMetadata,
        team,
        userImgHref: account?.img ?? null,
        account,
    };
    return { props };
});

export default UserPage;
