const ipfs = require('./ipfs');
const app = require("./app");
const options = require('./utils/options');
const db = require("./db/db");

const PORT = 3000;

(async () => {

    await db.sync({
        force: options.NEED_FORCE_SYNC,
    });

    app.listen(PORT, () => {

        console.log('Express server listening on port ' + PORT);

    });
})();

