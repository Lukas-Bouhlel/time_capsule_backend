'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Commentary extends Model {
    static associate(models) {
      Commentary.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Commentary.belongsTo(models.Capsule, {
        foreignKey: 'capsuleId',
        as: 'capsule'
      });
    }
  }

  Commentary.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le commentaire ne peut pas être vide" }
      }
    },
  }, {
    sequelize,
    modelName: 'Commentary',
    tableName: 'commentaries',
  });

  return Commentary;
};