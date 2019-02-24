const queryString = require('query-string');


module.exports = {
    checkAccessToken (req, res, next) {
        const param = (req.method == 'GET')? req.query: req.body;

        const access_token = req.cookies.superb_admin_access_token;
        if (!access_token) {
            const query_str = queryString.stringify(param);

            const redirect_url =
                    req.baseUrl + req.path + ((query_str=='')? '': '?'+query_str);
            return res.redirect(
                    '/login?' + queryString.stringify({'redirect_url': redirect_url}));
        }

        req.access_token = access_token;

        return next();
    },

    checkOmittedParams (essential_params) {
        return (req, res, next) => {
            const omitted = [];

            const param =
                    (req.method == 'GET')? req.query: req.body;

            for (const key of essential_params) {
                if (param[key] == undefined)
                    omitted.push(key);
            }

            if (omitted.length > 0) {
                return res.status(400).send({
                    message: 'some params are ommited.\n' + omitted.join(', ')
                });
            }

            return next();
        };
    },

    filterDisableParams (enable_params) {
        return (req, res, next) => {
            const param =
                    (req.method == 'GET')? req.query: req.body;

            for (const key of enable_params) {
                const value = param[key];
                if (value == undefined)
                    delete param[key];
            }

            return next();
        };
    },

    filterWithDisableParams (disable_params) {
        return (req, res, next) => {
            const param =
                    (req.method == 'GET')? req.query: req.body;

            for (const key of disable_params) {
                const value = param[key];
                if (value !== undefined)
                    delete param[key];
            }

            return next();
        };
    },

    handleError (req, res, e) {
        console.log('##### err ' + new Date(Date.now()));

        console.log(req.originalUrl);
        console.log(req.method);
        console.log(req.params);
        console.log(req.query);
        console.log(req.body);
        console.log(JSON.stringify(e, null, 2));
        console.log(e);

        const name = e['name'];
        if (name)
            console.log(name);

        if (!e['send'] || e['send'].length <= 0)
            delete e['send'];

        if (name == 'param error')
            return res.status(400).send(e['send']);
        else if (name == 'unauthorized') {
            const redirect_url = req.baseUrl + req.path;
            return res.redirect(
                '/login?' + queryString.stringify({'redirect_url': redirect_url}));
        }else if (name == 'client error')
            return res.status(404).send(e['send']);
        else if (name == 'server error')
            return res.status(500).send(e['send']);

        return res.status(500).send();
    },

    routerTemplate (
            func/*(req, res, next)=>void*/) {

        return async (req, res, next) => {
            try {
                await func(req, res, next);

            }catch (e) {
                this.handleError(req, res, e);
            }
        };
    },
};
