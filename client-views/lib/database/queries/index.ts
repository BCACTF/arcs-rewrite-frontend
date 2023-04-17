import ChallengeQuery from "./challs";
import SolveQuery from "./solves";
import TeamQuery from "./teams";
import UserQuery from "./users";

type WebhookDbQuery = UserQuery | TeamQuery | ChallengeQuery | SolveQuery;

export default WebhookDbQuery;

