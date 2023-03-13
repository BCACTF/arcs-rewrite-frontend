import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { SolveAttempt, SolveAttemptId } from './solve-attempt';

export interface ChallengeAttributes {
    id: string;
    name: any;
    description: string;
    flag: string;
    points: number;
    authors?: string[];
    hints?: string[];
    categories?: ("misc" | "binex" | "crypto" | "foren" | "rev" | "webex")[];
    tags: string[];
    links?: object;
    solveCount: number;
    visible: boolean;
    sourceFolder: string;
    insertedAt: Date;
    updatedAt: Date;
}

export type ChallengePk = "id";
export type ChallengeId = Challenge[ChallengePk];
export type ChallengeOptionalAttributes = "id" | "authors" | "hints" | "categories" | "links" | "solveCount" | "visible" | "insertedAt" | "updatedAt";
export type ChallengeCreationAttributes = Optional<ChallengeAttributes, ChallengeOptionalAttributes>;

export class Challenge extends Model<ChallengeAttributes, ChallengeCreationAttributes> implements ChallengeAttributes {
    id!: string;
    name!: any;
    description!: string;
    flag!: string;
    points!: number;
    authors?: string[];
    hints?: string[];
    categories?: ("misc" | "binex" | "crypto" | "foren" | "rev" | "webex")[];
    tags!: string[];
    links?: object;
    solveCount!: number;
    visible!: boolean;
    sourceFolder!: string;
    insertedAt!: Date;
    updatedAt!: Date;

    // Challenge hasMany SolveAttempt via challengeId
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

    static initModel(sequelize: Sequelize.Sequelize): typeof Challenge {
        return Challenge.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: "challenges_name_key"
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        flag: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        authors: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        },
        hints: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        },
        categories: {
            type: DataTypes.ARRAY(DataTypes.ENUM("misc","binex","crypto","foren","rev","webex")),
            allowNull: true
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        links: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        solveCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'solve_count'
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        sourceFolder: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'source_folder'
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
        tableName: 'challenges',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "challenges_name_key",
                unique: true,
                fields: [
                    { name: "name" },
                ]
            },
            {
                name: "challenges_pkey",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
        ]
    });
    }
}
