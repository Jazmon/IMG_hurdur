const Sequelize = require('sequelize');
const { database } = require('./config');

const sequelize = new Sequelize(database.name, database.user, database.password, {
  host: database.url,
  dialect: 'postgres',
  define: {
    freezeTableName: true,
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = sequelize;
