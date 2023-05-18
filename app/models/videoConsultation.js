"use strict ";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VideoConsultation extends Model {}

  VideoConsultation.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      source: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      destination: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      query_category: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      first_time_borrower: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      company_vintage_years: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company_vintage_months: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      requirement_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      query_date_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      request_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      banker_accepted_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      banker_rejected_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      destination_config_info: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_details: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      room_config: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      consultation_end_date_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      video_session_data: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      expiry_reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      module: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "VideoConsultation",
      tableName: "video_consultations",
    }
  );

  return VideoConsultation;
};
