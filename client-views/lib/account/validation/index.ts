// Components


// Hooks


// Types
import { GetServerSidePropsContext } from "next";
import { MyUser, UserState } from "account/types";
import { Eligibility, TeamAffiliationState } from "account/types/team";
import { getToken } from "next-auth/jwt";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { UserId } from "account/types/newtypes";


// Styles


// Utils

const getAccount = async ({ req, res }: GetServerSidePropsContext): Promise<MyUser | null> => {
    const session = await getServerSession(req, res, authOptions);

    const token = await getToken({ req });

    if (!token) return null;

    const id = UserId.parse(`user:oauth:github:${token?.sub}`);
    const holderName = token?.name ?? "Avery Calaman";
    const email = token?.email ?? "me@example.com";

    console.trace({ id, token });

    if (!id) return null;

    const account = {
        id,
        isAdminClientSide: false,
        
        isMe: true as const,
        holderName,
        email,

        affiliatedTeam: {
            id: "team:0123456789abcdef",
            name: "Swift Salad",
            eligibility: Eligibility.US_HIGH_SCHOOL,
        },
        score: {
            total: 0,
            solves: [],
        }
    };

    console.trace(account);
    return account;
};


export default getAccount;
