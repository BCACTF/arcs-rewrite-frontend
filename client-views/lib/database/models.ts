import { Sequelize } from "sequelize";
import { initModels } from "./models/init-models";
export {
    Challenge,
    SchemaMigration,
    SolveAttempt,
    TeamStat,
    Team,
    User,
    UsersToken,
} from "./models/init-models";
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
} from "./models/init-models";

const sequelize = new Sequelize(
    process.env.DBNAME ?? "bcactf",
    process.env.USERNAME ?? "bcactf",
    process.env.PASSWORD ?? "",
    { dialect: "postgres", define: { timestamps: false } },
);
initModels(sequelize);
