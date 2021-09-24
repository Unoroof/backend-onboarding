"use strict "
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProfileRevision extends Model { }

    ProfileRevision.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            profile_uuid: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            data: DataTypes.JSONB,
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
        },
        {
            sequelize,
            modelName: "ProfileRevision",
            tableName: "profile_revisions",
            updatedAt: false
        }
    );
    return ProfileRevision;
}
