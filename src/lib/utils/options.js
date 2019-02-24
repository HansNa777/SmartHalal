module.exports = {
    IS_DEBUG: process.argv.indexOf('--debug') >= 0,
    NEED_FORCE_SYNC: process.argv.indexOf('--force-sync') >= 0,
};
