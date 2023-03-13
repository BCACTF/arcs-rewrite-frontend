import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './user';

export interface UsersTokenAttributes {
    id: string;
    userId: string;
    token: any;
    context: string;
    sentTo?: string;
    insertedAt: Date;
}

export type UsersTokenPk = "id";
export type UsersTokenId = UsersToken[UsersTokenPk];
export type UsersTokenOptionalAttributes = "id" | "sentTo" | "insertedAt";
export type UsersTokenCreationAttributes = Optional<UsersTokenAttributes, UsersTokenOptionalAttributes>;

export class UsersToken extends Model<UsersTokenAttributes, UsersTokenCreationAttributes> implements UsersTokenAttributes {
    id!: string;
    userId!: string;
    token!: any;
    context!: string;
    sentTo?: string;
    insertedAt!: Date;

    // UsersToken belongsTo User via userId
    user!: User;
    getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
    setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
    createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

    static initModel(sequelize: Sequelize.Sequelize): typeof UsersToken {
        return UsersToken.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
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
        token: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        context: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        sentTo: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'sent_to'
        },
        insertedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'inserted_at'
        }
    }, {
        sequelize,
        tableName: 'users_tokens',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "users_tokens_pkey",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "userstoken_context_token_idx",
                unique: true,
                fields: [
                    { name: "context" },
                    { name: "token" },
                ]
            },
            {
                name: "usertoken_userid_idx",
                fields: [
                    { name: "user_id" },
                ]
            },
        ]
    });
    }
}
