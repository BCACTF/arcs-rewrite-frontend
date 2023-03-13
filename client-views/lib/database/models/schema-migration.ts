import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface SchemaMigrationAttributes {
    version: string;
    insertedAt?: Date;
}

export type SchemaMigrationPk = "version";
export type SchemaMigrationId = SchemaMigration[SchemaMigrationPk];
export type SchemaMigrationOptionalAttributes = "version" | "insertedAt";
export type SchemaMigrationCreationAttributes = Optional<SchemaMigrationAttributes, SchemaMigrationOptionalAttributes>;

export class SchemaMigration extends Model<SchemaMigrationAttributes, SchemaMigrationCreationAttributes> implements SchemaMigrationAttributes {
    version!: string;
    insertedAt?: Date;


    static initModel(sequelize: Sequelize.Sequelize): typeof SchemaMigration {
        return SchemaMigration.init({
        version: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        insertedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'inserted_at'
        }
    }, {
        sequelize,
        tableName: 'schema_migrations',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "schema_migrations_pkey",
                unique: true,
                fields: [
                    { name: "version" },
                ]
            },
        ]
    });
    }
}
