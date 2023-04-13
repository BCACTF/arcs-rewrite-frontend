import TeamQuery from "./teams";
import UserQuery from "./users";

type WebhookDbQuery = UserQuery | TeamQuery;

export type DbTeamMeta = {
    id: string;
    name: string;
    description: string;
    score: number;
    last_solve: number | null;
    eligible: boolean;
    affiliation: string | null;
};

export type DbUserMeta = {
    id: string;
    email: string;
    name: string;
    team_id: string;
    score: number;
    last_solve: number | null;
    eligible: boolean;
    admin: boolean;
};

export default WebhookDbQuery;

