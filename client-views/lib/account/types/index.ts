import Team, { TeamAffiliationState } from "./team";


export interface AccountInfo {
    id: string;
    holderName: string;
    isAdminClientSide: boolean;

    affiliatedTeam?: Team;
    teamAffiliationState: TeamAffiliationState;
    

}


export type AccountState = {
    loggedIn: true;
    info: AccountInfo;
} | {
    loggedIn: false;
};

