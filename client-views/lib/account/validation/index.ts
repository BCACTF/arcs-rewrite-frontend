// Components


// Hooks


// Types
import { GetServerSidePropsContext } from "next";
import { AccountState } from "account/types";
import { Eligibility, TeamAffiliationState } from "account/types/team";
import { getToken } from "next-auth/jwt";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";


// Styles


// Utils


const getAccount = async ({ req, res }: GetServerSidePropsContext): Promise<AccountState> => {
    // const token = context.req.cookies.authtoken;
    // if (!token) return { loggedIn: false, };

    await unstable_getServerSession(req, res, authOptions);

    const token = await getToken({ req });
    
    if (!token) return { loggedIn: false };



    return {
        loggedIn: true,
        info: {
            id: `user:github-oauth:${token?.sub}`,
            holderName: token?.name ?? "Avery Calaman",
            isAdminClientSide: false,
            teamAffiliationState: TeamAffiliationState.ACCEPTED,
            affiliatedTeam: {
                id: "team:0123456789abcdef",
                name: "Swift Salad",
                eligibility: Eligibility.US_HIGH_SCHOOL,
            }
        },
    }
};




export default getAccount;
