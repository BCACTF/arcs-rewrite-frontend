export enum TeamAffiliationState {
    NONE,
    REQUESTED,
    ACCEPTED,
}

export enum Eligibility {
    US_HIGH_SCHOOL,
    OTHER_HIGH_SCHOOL,
    US_COLLEGE,
    OTHER_COLLEGE,
    OTHER,
}

export default interface Team {
    id: string;
    name: string;
    eligibility: Eligibility;
}