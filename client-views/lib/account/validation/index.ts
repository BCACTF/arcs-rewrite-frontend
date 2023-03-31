// Components


// Hooks


// Types
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { CachedUser, getAllUsers } from "cache/users";


// Styles


// Utils

type Account = CachedUser & { img: string | null };

const getAccount = async ({ req, res }: GetServerSidePropsContext): Promise<Account | null> => {
    const session = await getServerSession(req, res, authOptions);

    const token = await getToken({ req });

    if (!token || !token.email) return null;

    const email = token.email;
    if (!email) return null;

    const users = await getAllUsers();
    const user = users.find(user => user.email === email);
    return user ? { ...user, img: token.picture ?? null } : null;

    // if (!id) return null;

    // const account = {
    //     id,
    //     isAdminClientSide: false,
        
    //     isMe: true as const,
    //     holderName,
    //     email,

    //     affiliatedTeam: {
    //         id: "team:0123456789abcdef",
    //         name: "Swift Salad",
    //         eligibility: Eligibility.US_HIGH_SCHOOL,
    //     },
    //     score: {
    //         total: 0,
    //         solves: [],
    //     }
    // };

    // console.trace(account);
    // return account;
};


export default getAccount;
