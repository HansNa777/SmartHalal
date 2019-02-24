const Sequelize = require('sequelize');

const host = 'localhost';
const db = 'blockchain_project';
const username = 'admin';
const password = 'blockchain';
const port = 3306;

const sequelize = new Sequelize(db, username, password, {
    host: host,
    dialect: 'mysql',
    port: port,
});
    /*{
    host: host,
    dialect: 'mysql',
    operatorsAliases: Sequelize.Op as any,
    database: db, 
    username: username,
    password: password,
    port: port,
    modelPaths: [__dirname + '/models'],
});*/

module.exports = sequelize;
