const path = require('path');
const express = require('express');
const md5 = require('md5');
const fs = require('fs');

const ipfs = require('../ipfs');
const route_util = require('../utils/route_util');

const Certificates = require('../db/models/Certificates');
const Certifiers   = require('../db/models/Certifiers'  );
const Items        = require('../db/models/Items'       );

const router = express.Router();


router.get(/external\/.+\.(?:js|css)$/,
    route_util.routerTemplate( async (req, res, next) => {
        const file_path = __dirname + '/../../node_modules/'
            + req.path.substr('external/'.length);
        res.sendFile(path.resolve(file_path));
    }),
);

router.get(/.+\.(?:js|css)$/,
    route_util.routerTemplate( async (req, res, next) => {
        const file_path = __dirname + '/../views' + req.baseUrl + req.path;
        res.sendFile(path.resolve(file_path));
    }),
);

router.get(/.+\.(?:png|jpg)$/,
    route_util.routerTemplate( async (req, res, next) => {
        const file_path = __dirname + '/../../images' + req.baseUrl + req.path;
        res.sendFile(path.resolve(file_path));
    }),
);



router.get('/',
    route_util.routerTemplate( async (req, res, next) => {

        const items = await Items.findAll({});

        res.render(
            'main',
            {
                items: JSON.stringify(items),
            }
        );
    }),
);

const item_key_filter = ['id', 'image_url', 'createdAt', 'updatedAt'];
const item_special_keys = ['additional_fields', 'description'];
router.get('/add-item',
    route_util.routerTemplate( async (req, res, next) => {

        const keys = Object.keys(await Items.describe()).filter((k) => item_key_filter.indexOf(k) < 0);
        res.render(
            'item/add',
            {
                keys        : JSON.stringify(keys             ),
                special_keys: JSON.stringify(item_special_keys),
            }
        );
    }),
);

router.post('/add-item',
    route_util.filterWithDisableParams(item_key_filter),
    route_util.routerTemplate( async (req, res, next) => {
        // upload image
        const img = req.files.image_src;
        if (img === undefined)
            return res.send('could not upload image');

        const name_splited = img.name.split('.');
        const ext = name_splited[name_splited.length - 1];
        const hash = md5(img.data) + '.' + md5(img.data.slice(0, img.data.length/2));
        const img_path = 'items/' + hash + '.' + ext;
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
        req.body.additional_fields = req.body.additional_fields.replace(/\r\n/g, '\n');
        req.body.image_url = img_path;
        await Items.create(req.body);

        res.redirect('/');
    }),
);

router.get('/item/:id',
    route_util.routerTemplate( async (req, res, next) => {

        const id = req.params.id;
        const item = await Items.findOne({
            where: {
                id: id,
            },
        });
        if (item == null)
            return res.send('' + id + ': 없는 아이템 id 입니다.');


        const certificates = await Certificates.findAll({
            include: [
                {
                    model: Certifiers,
                    as: 'Certifier',
                },
            ],
            where: {
                item_id: item.id,
            },
        });
        for (const ci in certificates) {
            certificates[ci] = certificates[ci].toJSON();
            const cert = certificates[ci];
            delete cert.Certifier.login_id;
            delete cert.Certifier.password;
        }

        res.render(
            'item/detail',
            {
                item: JSON.stringify(item),
                certificates: JSON.stringify(certificates),
            }
        );
    }),
);





module.exports = router;
