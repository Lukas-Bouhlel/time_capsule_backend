'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Capsule extends Model {
    static associate(models) {
      Capsule.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Capsule.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Capsule',
    tableName: 'capsules',
    timestamps: true
  });

  return Capsule;
};