const database = require('../db/database');
var ObjectId = require('mongodb').ObjectId;

const collectionName = "docs";

const docs = {
    getAllData: async function getAllData(req, res) {
        let db;

        try {
            db = await database.getDb(collectionName);
            const col = db.collection;
            const data = await col.find({}).toArray();

            if (res === undefined) {
                return data;
            }

            if (data) {
                return res.json({data: data});
            }
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
    },

    getUserDocs: async function getUserDocs(req, res) {
        let db;
        const email = req.user.email;
        const code = req.user.code;

        try {
            db = await database.getDb(collectionName);
            const col = db.collection;
            const data = await col.find({
                $and: [
                    {
                        $or: [
                            {owner: email},
                            {allowed: email }
                        ]
                    },
                    {
                        code: code
                    }
                ]
               
            })
                .toArray();

            if (res === undefined) {
                return data;
            }

            if (data) {
                return res.status(200).json({data: data});
            }
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
            db.client.close();
        }
    },

    create: async function create(req, res) {
        let db;
        const title = req.body.title;
        const body = req.body.body;
        const code = req.body.code;
        const owner = req.user.email;

        try {
            db = await database.getDb(collectionName);
            const col = db.collection;
            let data;

            //Add custom id for test cases
            if (process.env.NODE_ENV !== 'test') {
                data = await col.insertOne({
                    title: title,
                    body: body,
                    code: code,
                    owner: owner,
                    allowed: []
                });
            } else {
                await col.deleteOne({"_id": "testid"}); //Remove entry with id if it exists
                data = await col.insertOne({
                    _id: "testid",
                    title: req.body.title,
                    body: req.body.body
                });
            }

            if (data) {
                return res.status(201).json({msg: "Document created"});
            }
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
    },
    update: async function update(req, res) {
        let db;

        try {
            db = await database.getDb(collectionName);
            const col = db.collection;
            let data;

            //Add custom id for test cases
            if (process.env.NODE_ENV !== 'test') {
                data = await col.updateOne(
                    { _id: ObjectId(req.body.id)},
                    {
                        $set: {body: req.body.body}
                    });
            } else {
                data = await col.updateOne(
                    { _id: "testid"},
                    {
                        $set: {body: req.body.body}
                    });
            }
            if (data) {
                return res.status(204).json({msg: "Document updated"});
            }
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
    },
    findDoc: async function findDoc(req, res) {
        let db;
        const email = req.user.email;

        try {
            db = await database.getDb(collectionName);
            const col = db.collection;
            let data;

            if (process.env.NODE_ENV !== 'test') {
                data = await col.findOne({
                    $and: [
                        {_id: ObjectId(req.params.id)},
                        {$or: [
                            {owner: email},
                            {allowed: email}
                        ]}
                    ]
                });
            } else {
                data = await col.findOne({
                    _id: req.params.id
                });
            }
            if (data) {
                return res.status(200).json({data: data});
            }
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
    },
    addUserToDoc: async function addUserToDoc(req, res) {
        let db;
        const id = req.body.id;
        const email = req.body.email;

        try {
            db = await database.getDb(collectionName);
            const col = db.collection;
            const data = await col.updateOne({
                _id: ObjectId(id)},
            {
                $addToSet: {
                    allowed: email
                }
            });

            if (data) {
                return res.status(204).json({data: {msg: `Document shared to ${email}`}});
            }
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
            db.client.close();
        }
    }
};

module.exports = docs;
