const path = require('path');
const express = require('express');
const md5 = require('md5');
const fs = require('fs');

const route_util = require('../utils/route_util');

const Certifiers   = require('../db/models/Certifiers'  );

const router = express.Router();


router.get('/',
    route_util.routerTemplate( async (req, res, next) => {
        res.send(req.baseUrl.substr(1));
    }),
);


const item_key_filter = ['id', 'image_url', 'createdAt', 'updatedAt'];
router.get('/add',
    route_util.routerTemplate( async (req, res, next) => {

        const keys = Object.keys(await Certifiers.describe()).filter((k) => item_key_filter.indexOf(k) < 0);
        const special_keys = ['description'];

        res.render(
            req.baseUrl.substr(1) + '/add',
            {
                keys : JSON.stringify(keys),
                special_keys: JSON.stringify(special_keys),
            }
        );
    }),
);

router.post('/add',
    route_util.filterWithDisableParams(item_key_filter),
    route_util.routerTemplate( async (req, res, next) => {
        // upload image
        const img = req.files.image_src;
        if (img === undefined)
            return res.send('could not upload image');

        const name_splited = img.name.split('.');
        const ext = name_splited[name_splited.length - 1];
        const hash = md5(img.data) + '.' + md5(img.data.slice(0, img.data.length/2));
        const img_path = 'certifiers/' + hash + '.' + ext;
        const out_path = __dirname + '/../../images/' + img_path;
        await new Promise((resolve, reject)=> {
            fs.writeFile(
                out_path,
                img.data,
                (err) => {
                    if (err) reject(err);
                    else     resolve();
                }
            );
        });


        
        // create row
        req.body.image_url = img_path;
        await Certifiers.create(req.body);

        res.redirect('/');
    }),
);





module.exports = router;
