"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      Game.hasMany(models.Event, {
        foreignKey: "game_id",
        as: "events",
      });
    }
  }

  Game.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      description: DataTypes.TEXT,
      logo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Game",
      tableName: "games",
      underscored: true,
    },
  );

  return Game;
};
