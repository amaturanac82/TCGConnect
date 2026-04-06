"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.Game, {
        foreignKey: "game_id",
        as: "game",
      });

      Event.belongsTo(models.User, {
        foreignKey: "organizer_id",
        as: "organizer",
      });

      Event.belongsToMany(models.User, {
        through: models.SavedEvent,
        foreignKey: "event_id",
        otherKey: "user_id",
        as: "usersWhoSaved",
      });
    }
  }

  Event.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      format: DataTypes.STRING,
      locationname: {
        type: DataTypes.STRING,
        field: "location_name",
      },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      eventdate: {
        type: DataTypes.DATE,
        field: "event_date",
      },
      registrationurl: {
        type: DataTypes.STRING,
        field: "registration_url",
      },
      flyer: DataTypes.STRING,
      isactive: {
        type: DataTypes.BOOLEAN,
        field: "is_active",
      },
      gameid: {
        type: DataTypes.INTEGER,
        field: "game_id",
      },
      organizerid: {
        type: DataTypes.INTEGER,
        field: "organizer_id",
      },
    },
    {
      sequelize,
      modelName: "Event",
      tableName: "events",
      underscored: true,
    }
  );

  return Event;
};