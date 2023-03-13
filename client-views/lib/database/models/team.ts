import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { SolveAttempt, SolveAttemptId } from './solve-attempt';
import type { TeamStat, TeamStatId } from './team-stat';

export interface TeamAttributes {
    id: string;
    name: any;
    description?: string;
    score?: number;
    lastSolve?: Date;
    eligible: boolean;
    affiliation?: string;
    hashedPassword?: string;
    insertedAt: Date;
    updatedAt: Date;
}

export type TeamPk = "id";
export type TeamId = Team[TeamPk];
export type TeamOptionalAttributes = "id" | "description" | "score" | "lastSolve" | "affiliation" | "hashedPassword" | "insertedAt" | "updatedAt";
export type TeamCreationAttributes = Optional<TeamAttributes, TeamOptionalAttributes>;

export class Team extends Model<TeamAttributes, TeamCreationAttributes> implements TeamAttributes {
    id!: string;
    name!: any;
    description?: string;
    score?: number;
    lastSolve?: Date;
    eligible!: boolean;
    affiliation?: string;
    hashedPassword?: string;
    insertedAt!: Date;
    updatedAt!: Date;

    // Team hasMany SolveAttempt via teamId
    solveAttempts!: SolveAttempt[];
    getSolveAttempts!: Sequelize.HasManyGetAssociationsMixin<SolveAttempt>;
    setSolveAttempts!: Sequelize.HasManySetAssociationsMixin<SolveAttempt, SolveAttemptId>;
    addSolveAttempt!: Sequelize.HasManyAddAssociationMixin<SolveAttempt, SolveAttemptId>;
    addSolveAttempts!: Sequelize.HasManyAddAssociationsMixin<SolveAttempt, SolveAttemptId>;
    createSolveAttempt!: Sequelize.HasManyCreateAssociationMixin<SolveAttempt>;
    removeSolveAttempt!: Sequelize.HasManyRemoveAssociationMixin<SolveAttempt, SolveAttemptId>;
    removeSolveAttempts!: Sequelize.HasManyRemoveAssociationsMixin<SolveAttempt, SolveAttemptId>;
    hasSolveAttempt!: Sequelize.HasManyHasAssociationMixin<SolveAttempt, SolveAttemptId>;
    hasSolveAttempts!: Sequelize.HasManyHasAssociationsMixin<SolveAttempt, SolveAttemptId>;
    countSolveAttempts!: Sequelize.HasManyCountAssociationsMixin;
    // Team hasMany TeamStat via teamId
    teamStats!: TeamStat[];
    getTeamStats!: Sequelize.HasManyGetAssociationsMixin<TeamStat>;
    setTeamStats!: Sequelize.HasManySetAssociationsMixin<TeamStat, TeamStatId>;
    addTeamStat!: Sequelize.HasManyAddAssociationMixin<TeamStat, TeamStatId>;
    addTeamStats!: Sequelize.HasManyAddAssociationsMixin<TeamStat, TeamStatId>;
    createTeamStat!: Sequelize.HasManyCreateAssociationMixin<TeamStat>;
    removeTeamStat!: Sequelize.HasManyRemoveAssociationMixin<TeamStat, TeamStatId>;
    removeTeamStats!: Sequelize.HasManyRemoveAssociationsMixin<TeamStat, TeamStatId>;
    hasTeamStat!: Sequelize.HasManyHasAssociationMixin<TeamStat, TeamStatId>;
    hasTeamStats!: Sequelize.HasManyHasAssociationsMixin<TeamStat, TeamStatId>;
    countTeamStats!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof Team {
        return Team.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: "teams_name_key"
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        lastSolve: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'last_solve'
        },
        eligible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        affiliation: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        hashedPassword: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'hashed_password'
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
        tableName: 'teams',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "teams_name_idx",
                unique: true,
                fields: [
                    { name: "name" },
                ]
            },
            {
                name: "teams_name_key",
                unique: true,
                fields: [
                    { name: "name" },
                ]
            },
            {
                name: "teams_pkey",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
        ]
    });
    }
}
