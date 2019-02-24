const express = require('express');
const md5 = require('md5');

const route_util = require('../utils/route_util');

const Certificates = require('../db/models/Certificates');
const Certifiers   = require('../db/models/Certifiers'  );

const router = express.Router();


router.get('/',
    route_util.routerTemplate( async (req, res, next) => {
        res.send(req.baseUrl.substr(1));
    }),
);


const item_key_filter = ['id', 'createdAt', 'updatedAt'];
router.get('/add',
    route_util.routerTemplate( async (req, res, next) => {

        const keys = Object.keys(await Certificates.describe()).filter((k) => item_key_filter.indexOf(k) < 0);

        const static_keys = ['pre_cert_id', 'item_id', 'certifier_id'];
        const special_keys = ['content'];

        const certifiers = await Certifiers.findAll({
            attributes: ['id', 'name'],
        });

        const first_cert_id = (certifiers.length > 0)? certifiers[0].id: -1;

        const data = {
            pre_cert_id : req.query.pre_cert_id,
            item_id     : req.query.item_id,
            certifier_id: first_cert_id,
        };

        res.render(
            req.baseUrl.substr(1) + '/add',
            {
                keys        : JSON.stringify(keys),
                static_keys : JSON.stringify(static_keys),
                special_keys: JSON.stringify(special_keys),
                data : JSON.stringify(data),

                certifiers: JSON.stringify(certifiers),
            }
        );
    }),
);

router.post('/add',
    route_util.filterWithDisableParams(item_key_filter),
    route_util.routerTemplate( async (req, res, next) => {
        for (const key in req.body) {
            if (req.body[key] == 'null')
                req.body[key] = null;
        }
        
        // create row
        await Certificates.create(req.body);

        res.redirect('/item/' + req.body.item_id);
    }),
);





module.exports = router;
