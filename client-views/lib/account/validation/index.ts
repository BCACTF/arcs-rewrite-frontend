// Components


// Hooks


// Types
import { GetServerSidePropsContext } from "next";
import { AccountState } from "account/types";
import { Eligibility, TeamAffiliationState } from "account/types/team";


// Styles


// Utils


const getAccount = (context: GetServerSidePropsContext): AccountState => {
    const token = context.req.cookies.authtoken;
    if (!token) return { loggedIn: false, };
    
    return {
        loggedIn: true,
        info: {
            id: "user:0123456789abcdef",
            holderName: "Avery Calaman",
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
