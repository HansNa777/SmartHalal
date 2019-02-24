const Sequelize = require('sequelize');
const db = require('../db');
const options = require('../../utils/options');

const table = db.define('Certifiers', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    login_id: Sequelize.STRING(50),
    password: Sequelize.STRING(50),
    name: Sequelize.STRING(50),
    image_url: Sequelize.STRING(255),
    latitude : Sequelize.STRING(50),
    longitude: Sequelize.STRING(50),
    address: Sequelize.STRING(255),
    description: Sequelize.TEXT,
});


/*
(async () => {
    await table.sync({
        force: options.NEED_FORCE_SYNC,
    });
})();
*/

module.exports = table;
