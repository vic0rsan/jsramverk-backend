const mongo = require("mongodb").MongoClient;
//const config = require("./config.json");
const collectionName = "docs";
var ObjectId = require('mongodb').ObjectId;

const database = {
    getDb: async function getDb() {
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}` +
        `@clusterjs.pahxun2.mongodb.net/jseditor?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    },
    getAllData: async function getAllData(res) {
        let db;

        try {
            db = await database.getDb();
            const col = db.collection;

            const data = await col.find({}).toArray();

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

    create: async function create(req, res) {
        let db;

        try {
            db = await database.getDb();
            const col = db.collection;
            let data;

            //Add custom id for test cases
            if (process.env.NODE_ENV !== 'test') {
                data = await col.insertOne({
                    title: req.body.title,
                    body: req.body.body
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
            db = await database.getDb();
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

        try {
            db = await database.getDb();
            const col = db.collection;
            let data;

            if (process.env.NODE_ENV !== 'test') {
                data = await col.findOne({
                    _id: ObjectId(req.params.id)
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
    }
};

module.exports = database;
