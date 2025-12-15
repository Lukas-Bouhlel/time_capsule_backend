const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false 
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Base de données SQL (Sequelize) connectée !');
  } catch (error) {
    console.error('❌ Impossible de se connecter à la BDD:', error);
  }
};

module.exports = { sequelize, connectDB };