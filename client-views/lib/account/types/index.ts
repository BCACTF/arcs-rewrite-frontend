import { UserId } from "./newtypes";
import { deserUserSolve, serUserSolve, UserSolve } from "./solves";
import Team, { TeamAffiliationState } from "./team";


export interface UserScore {
    total: number;
    solves: UserSolve[];
}

export interface BaseUser {
    id: UserId;
    
    holderName: string;
    isAdminClientSide: boolean;

    affiliatedTeam?: Team;

    score: UserScore;
}

export interface OtherUser extends BaseUser { isMe: false; }

export interface MyUser extends BaseUser {
    isMe: true;
    email: string;
}

export const serMyUser = (user: MyUser) => ({
    ...user,
    id: user.id.formatted,
    score: {
        total: user.score.total,
        solves: user.score.solves.map(serUserSolve),
    },
});
export const deserMyUser = (user: ReturnType<typeof serMyUser>): MyUser | null => {
    const id = UserId.parse(user.id);
    const optSolves = user.score.solves.map(deserUserSolve);

    if (!id || optSolves.some(val => val === null)) return null;
    const solves = optSolves.flatMap(solve => solve === null ? [] : [solve]);

    return {
        ...user,
        id,
        score: {
            total: user.score.total,
            solves,
        },
    };
};

type UserInfo = OtherUser | MyUser;
export default UserInfo;

export type UserState = UserInfo | null;
