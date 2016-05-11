const Sequelize = require('sequelize');
const path = require('path');
//const { database } = require('./config');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, 'config', 'config.json'))[env];

/*const sequelize = new Sequelize(database.name, database.user, null, {
  host: database.host,
  dialect: 'postgres',
  define: {
    freezeTableName: true,
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});*/


//const sequelize = new Sequelize('postgres://imghurdur:atte425@127.0.0.1:543/imghurdur');
const sequelize = new Sequelize(config.database, config.username, config.password, config);
module.exports = sequelize;
