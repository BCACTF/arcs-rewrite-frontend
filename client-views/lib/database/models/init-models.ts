import type { Sequelize } from "sequelize";
import { Challenge as _Challenge } from "./challenge";
import type { ChallengeAttributes, ChallengeCreationAttributes } from "./challenge";
import { SchemaMigration as _SchemaMigration } from "./schema-migration";
import type { SchemaMigrationAttributes, SchemaMigrationCreationAttributes } from "./schema-migration";
import { SolveAttempt as _SolveAttempt } from "./solve-attempt";
import type { SolveAttemptAttributes, SolveAttemptCreationAttributes } from "./solve-attempt";
import { TeamStat as _TeamStat } from "./team-stat";
import type { TeamStatAttributes, TeamStatCreationAttributes } from "./team-stat";
import { Team as _Team } from "./team";
import type { TeamAttributes, TeamCreationAttributes } from "./team";
import { User as _User } from "./user";
import type { UserAttributes, UserCreationAttributes } from "./user";
import { UsersToken as _UsersToken } from "./users-token";
import type { UsersTokenAttributes, UsersTokenCreationAttributes } from "./users-token";

export {
    _Challenge as Challenge,
    _SchemaMigration as SchemaMigration,
    _SolveAttempt as SolveAttempt,
    _TeamStat as TeamStat,
    _Team as Team,
    _User as User,
    _UsersToken as UsersToken,
};

export type {
    ChallengeAttributes,
    ChallengeCreationAttributes,
    SchemaMigrationAttributes,
    SchemaMigrationCreationAttributes,
    SolveAttemptAttributes,
    SolveAttemptCreationAttributes,
    TeamStatAttributes,
    TeamStatCreationAttributes,
    TeamAttributes,
    TeamCreationAttributes,
    UserAttributes,
    UserCreationAttributes,
    UsersTokenAttributes,
    UsersTokenCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
    const Challenge = _Challenge.initModel(sequelize);
    const SchemaMigration = _SchemaMigration.initModel(sequelize);
    const SolveAttempt = _SolveAttempt.initModel(sequelize);
    const TeamStat = _TeamStat.initModel(sequelize);
    const Team = _Team.initModel(sequelize);
    const User = _User.initModel(sequelize);
    const UsersToken = _UsersToken.initModel(sequelize);

    SolveAttempt.belongsTo(Challenge, { as: "challenge", foreignKey: "challengeId"});
    Challenge.hasMany(SolveAttempt, { as: "solveAttempts", foreignKey: "challengeId"});
    SolveAttempt.belongsTo(Team, { as: "team", foreignKey: "teamId"});
    Team.hasMany(SolveAttempt, { as: "solveAttempts", foreignKey: "teamId"});
    TeamStat.belongsTo(Team, { as: "team", foreignKey: "teamId"});
    Team.hasMany(TeamStat, { as: "teamStats", foreignKey: "teamId"});
    SolveAttempt.belongsTo(User, { as: "user", foreignKey: "userId"});
    User.hasMany(SolveAttempt, { as: "solveAttempts", foreignKey: "userId"});
    UsersToken.belongsTo(User, { as: "user", foreignKey: "userId"});
    User.hasMany(UsersToken, { as: "usersTokens", foreignKey: "userId"});

    return {
        Challenge: Challenge,
        SchemaMigration: SchemaMigration,
        SolveAttempt: SolveAttempt,
        TeamStat: TeamStat,
        Team: Team,
        User: User,
        UsersToken: UsersToken,
    };
}
