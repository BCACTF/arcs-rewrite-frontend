import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Team, TeamId } from './team';

export interface TeamStatAttributes {
    id: string;
    score?: number;
    teamId?: string;
    insertedAt: Date;
}

export type TeamStatPk = "id";
export type TeamStatId = TeamStat[TeamStatPk];
export type TeamStatOptionalAttributes = "id" | "score" | "teamId" | "insertedAt";
export type TeamStatCreationAttributes = Optional<TeamStatAttributes, TeamStatOptionalAttributes>;

export class TeamStat extends Model<TeamStatAttributes, TeamStatCreationAttributes> implements TeamStatAttributes {
    id!: string;
    score?: number;
    teamId?: string;
    insertedAt!: Date;

    // TeamStat belongsTo Team via teamId
    team!: Team;
    getTeam!: Sequelize.BelongsToGetAssociationMixin<Team>;
    setTeam!: Sequelize.BelongsToSetAssociationMixin<Team, TeamId>;
    createTeam!: Sequelize.BelongsToCreateAssociationMixin<Team>;

    static initModel(sequelize: Sequelize.Sequelize): typeof TeamStat {
        return TeamStat.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        teamId: {
            type: DataTypes.UUID,
            allowNull: true,
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
        }
    }, {
        sequelize,
        tableName: 'team_stats',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "team_stats_pkey",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "teamstats_teamid_idx",
                fields: [
                    { name: "team_id" },
                ]
            },
        ]
    });
    }
}
