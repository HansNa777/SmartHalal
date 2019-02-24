const Sequelize = require('sequelize');
const db = require('../db');
const options = require('../../utils/options');

const table = db.define('Items', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING(50),
    image_url: Sequelize.STRING(255),
    additional_fields: Sequelize.TEXT, // json
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
