const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const mustache = require('mustache-express');
const db = require('./db/db');
const api_main         = require("./routes/main"        );
const api_certificates = require("./routes/certificates");
const api_certifiers   = require("./routes/certifiers"  );

class App {
    constructor () {
        this.app = express();
        this.config();

        this.app.use('/'            , api_main        );
        this.app.use('/certificates', api_certificates);
        this.app.use('/certifiers'  , api_certifiers  );
    }

    config () {

		//this.app.engine  ('html',        template.mustache);
        this.app.engine('html', mustache());
		this.app.set     ('view engine', 'html');
        this.app.set     ('views',      __dirname + '/views');

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json( { limit: '5mb' } ));

        this.app.use(cookieParser());

        this.app.use(fileUpload());

        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Expose-Headers", "x-total-count");
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
            res.header("Access-Control-Allow-Headers", "Content-Type,authorization");

            next();
        });
    }
}

module.exports = new App().app;
