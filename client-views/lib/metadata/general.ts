const env = process.env;

export type JsonDate = number;

export interface CompetitionMetadata {
    name: string;
    start: JsonDate;
    end: JsonDate;
}



export const getCompetitionMetadata = (): CompetitionMetadata => ({
    name: env.COMPETITION_NAME ?? "BCACTF",
    start: parseInt(env.COMPETITION_START ?? "0"),
    end: parseInt(env.COMPETITION_END ?? "0"),
});

export interface Metadata {
    competition: CompetitionMetadata;
}




