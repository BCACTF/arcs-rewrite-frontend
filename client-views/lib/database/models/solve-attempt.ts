import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Challenge, ChallengeId } from './challenge';
import type { Team, TeamId } from './team';
import type { User, UserId } from './user';

export interface SolveAttemptAttributes {
    id: string;
    flagGuess: string;
    correct: boolean;
    userId: string;
    challengeId: string;
    teamId: string;
    insertedAt: Date;
    updatedAt: Date;
}

export type SolveAttemptPk = "id";
export type SolveAttemptId = SolveAttempt[SolveAttemptPk];
export type SolveAttemptOptionalAttributes = "id" | "insertedAt" | "updatedAt";
export type SolveAttemptCreationAttributes = Optional<SolveAttemptAttributes, SolveAttemptOptionalAttributes>;

export class SolveAttempt extends Model<SolveAttemptAttributes, SolveAttemptCreationAttributes> implements SolveAttemptAttributes {
    id!: string;
    flagGuess!: string;
    correct!: boolean;
    userId!: string;
    challengeId!: string;
    teamId!: string;
    insertedAt!: Date;
    updatedAt!: Date;

    // SolveAttempt belongsTo Challenge via challengeId
    challenge!: Challenge;
    getChallenge!: Sequelize.BelongsToGetAssociationMixin<Challenge>;
    setChallenge!: Sequelize.BelongsToSetAssociationMixin<Challenge, ChallengeId>;
    createChallenge!: Sequelize.BelongsToCreateAssociationMixin<Challenge>;
    // SolveAttempt belongsTo Team via teamId
    team!: Team;
    getTeam!: Sequelize.BelongsToGetAssociationMixin<Team>;
    setTeam!: Sequelize.BelongsToSetAssociationMixin<Team, TeamId>;
    createTeam!: Sequelize.BelongsToCreateAssociationMixin<Team>;
    // SolveAttempt belongsTo User via userId
    user!: User;
    getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
    setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
    createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

    static initModel(sequelize: Sequelize.Sequelize): typeof SolveAttempt {
        return SolveAttempt.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        flagGuess: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'flag_guess'
        },
        correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            field: 'user_id'
        },
        challengeId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'challenges',
                key: 'id'
            },
            field: 'challenge_id'
        },
        teamId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'teams',
                key: 'id'
            },
            field: 'team_id'
        },
        insertedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'inserted_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'updated_at'
        }
    }, {
        sequelize,
        tableName: 'solve_attempts',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "solve_attempts_pkey",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "solves_chalid_idx",
                fields: [
                    { name: "challenge_id" },
                ]
            },
            {
                name: "solves_teamid_idx",
                fields: [
                    { name: "team_id" },
                ]
            },
            {
                name: "solves_userid_idx",
                fields: [
                    { name: "user_id" },
                ]
            },
        ]
    });
    }
}
