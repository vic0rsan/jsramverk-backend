var express = require('express');
var router = express.Router();
const docs = require('../models/docs');
const auth = require('../models/auth');

router.get('/',
    async (req, res, next) => await auth.checkToken(req, res, next),
    async (req, res) => await docs.getUserDocs(req, res)
);

router.get('/seldoc/:id',
    async (req, res, next) => await auth.checkToken(req, res, next),
    async (req, res) => await docs.findDoc(req, res)
);

router.post('/create',
    async (req, res, next) => await auth.checkToken(req, res, next),
    async (req, res) => await docs.create(req, res)
);

router.put('/update',
    async (req, res, next) => await auth.checkToken(req, res, next),
    async (req, res) => await docs.update(req, res)
);

router.put('/addusertodoc',
    async (req, res, next) => await auth.checkToken(req, res, next),
    async (req, res) => await docs.addUserToDoc(req, res)
);

module.exports = router;
