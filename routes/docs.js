var express = require('express');
var router = express.Router();
const database = require('../db/database');


router.get('/list', async function(req, res, next) {
    let db;

    try {
        db = await database.getDb();
        const col = db.collection;
        await col.find().toArray().then((item) => {
            res.json(item)
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            db.client.close();
        });      
    } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: "/",
                title: "Database error",
                detail: e.message
            }
        });
    } finally {
        await db.client.close();
    }
    });

router.get('/seldoc/:id', async function(req, res) {
    await database.findDoc(req, res);
})

router.post('/create', async function(req, res) {
    await database.create(req, res);
});

router.put('/update', async function(req, res) {
    await database.update(req, res);
})
module.exports = router;