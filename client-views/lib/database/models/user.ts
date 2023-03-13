import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { SolveAttempt, SolveAttemptId } from './solve-attempt';
import type { UsersToken, UsersTokenId } from './users-token';

export interface UserAttributes {
    id: string;
    email: any;
    name: any;
    teamId?: string;
    score?: number;
    lastSolve?: Date;
    type: "default" | "eligible" | "admin";
    hashedPassword: string;
    insertedAt: Date;
    updatedAt: Date;
    confirmedAt?: Date;
}

export type UserPk = "id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "id" | "teamId" | "score" | "lastSolve" | "type" | "insertedAt" | "updatedAt" | "confirmedAt";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id!: string;
    email!: any;
    name!: any;
    teamId?: string;
    score?: number;
    lastSolve?: Date;
    type!: "default" | "eligible" | "admin";
    hashedPassword!: string;
    insertedAt!: Date;
    updatedAt!: Date;
    confirmedAt?: Date;

    // User hasMany SolveAttempt via userId
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
    // User hasMany UsersToken via userId
    usersTokens!: UsersToken[];
    getUsersTokens!: Sequelize.HasManyGetAssociationsMixin<UsersToken>;
    setUsersTokens!: Sequelize.HasManySetAssociationsMixin<UsersToken, UsersTokenId>;
    addUsersToken!: Sequelize.HasManyAddAssociationMixin<UsersToken, UsersTokenId>;
    addUsersTokens!: Sequelize.HasManyAddAssociationsMixin<UsersToken, UsersTokenId>;
    createUsersToken!: Sequelize.HasManyCreateAssociationMixin<UsersToken>;
    removeUsersToken!: Sequelize.HasManyRemoveAssociationMixin<UsersToken, UsersTokenId>;
    removeUsersTokens!: Sequelize.HasManyRemoveAssociationsMixin<UsersToken, UsersTokenId>;
    hasUsersToken!: Sequelize.HasManyHasAssociationMixin<UsersToken, UsersTokenId>;
    hasUsersTokens!: Sequelize.HasManyHasAssociationsMixin<UsersToken, UsersTokenId>;
    countUsersTokens!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof User {
        return User.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: "users_email_key"
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: "users_name_key"
        },
        teamId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'team_id'
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
        type: {
            type: DataTypes.ENUM("default","eligible","admin"),
            allowNull: false,
            defaultValue: "default"
        },
        hashedPassword: {
            type: DataTypes.STRING(255),
            allowNull: false,
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
        },
        confirmedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'confirmed_at'
        }
    }, {
        sequelize,
        tableName: 'users',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "user_email_idx",
                unique: true,
                fields: [
                    { name: "email" },
                ]
            },
            {
                name: "user_name_idx",
                unique: true,
                fields: [
                    { name: "name" },
                ]
            },
            {
                name: "users_email_key",
                unique: true,
                fields: [
                    { name: "email" },
                ]
            },
            {
                name: "users_name_key",
                unique: true,
                fields: [
                    { name: "name" },
                ]
            },
            {
                name: "users_pkey",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
        ]
    });
    }
}
