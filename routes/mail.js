var express = require('express');
var router = express.Router();
const auth = require('../models/auth');
const mail = require('../models/mail');

router.post('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => mail.sendMail(req, res)
);

module.exports = router;
