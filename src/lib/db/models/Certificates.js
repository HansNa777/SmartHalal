const Sequelize = require('sequelize');
const db = require('../db');
const options = require('../../utils/options');

const Certifiers = require('./Certifiers');
const Items = require('./Items');

const table = db.define('Certificates', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    pre_cert_id: Sequelize.INTEGER,
    item_id: Sequelize.INTEGER,
    certifier_id: Sequelize.INTEGER,
    content: Sequelize.TEXT, // json
});

table.belongsTo(table     , {as: 'Precert'  , foreignKey: { name: 'pre_cert_id', allowNull: true } , targetKey: 'id'});
table.belongsTo(Items     , {as: 'Item'     , foreignKey: 'item_id'     , targetKey: 'id'});
table.belongsTo(Certifiers, {as: 'Certifier', foreignKey: 'certifier_id', targetKey: 'id'});


/*
(async () => {
    await table.sync({
        force: options.NEED_FORCE_SYNC,
    });
})();
*/

module.exports = table;
