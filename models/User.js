"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Event, {
        foreignKey: "organizer_id",
        as: "organizedEvents",
      });

      User.belongsToMany(models.Event, {
        through: models.SavedEvent,
        foreignKey: "user_id",
        otherKey: "event_id",
        as: "savedEvents",
      });
    }
  }

  User.init(
    {
      fullname: {
        type: DataTypes.STRING,
        field: "full_name",
      },
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      city: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
    }
  );

  return User;
};