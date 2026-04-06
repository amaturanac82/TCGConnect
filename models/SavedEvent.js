"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SavedEvent extends Model {
    static associate(models) {
      SavedEvent.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      SavedEvent.belongsTo(models.Event, {
        foreignKey: "event_id",
        as: "event",
      });
    }
  }

  SavedEvent.init(
    {
      user_id: DataTypes.INTEGER,
      event_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SavedEvent",
      tableName: "saved_events",
      underscored: true,
    },
  );

  return SavedEvent;
};
