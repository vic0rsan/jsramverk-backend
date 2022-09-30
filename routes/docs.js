var express = require('express');
var router = express.Router();
const database = require('../db/database');


router.get('/', async (req, res) => {
    await database.getAllData(res);
});

router.get('/seldoc/:id', async (req, res) => {
    await database.findDoc(req, res);
});

router.post('/create', async (req, res) => {
    await database.create(req, res);
});

router.put('/update', async (req, res) => {
    await database.update(req, res);
});

module.exports = router;
