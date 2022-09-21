const mongo = require("mongodb").MongoClient;
//const config = require("./config.json");
const collectionName = "docs";
var ObjectId = require('mongodb').ObjectId;

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@clusterjs.pahxun2.mongodb.net/jseditor?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/mumin";
        }

        const client  = await mongo.connect(dsn, {
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
    create: async function create (req, res) {
        const db = await database.getDb();
        const col = db.collection;
        await col.insertOne({
            title: req.body.title,
            body: req.body.body
        }, function(err) {
            if (err) {
                throw err;
            }
            db.client.close();
            res.status(201).json();
        });
    },
    update: async function update (req, res) {
        const db = await database.getDb();
        const col = db.collection;
        await col.updateOne(
            {
                _id: ObjectId(req.body.id)}, 
                {
                    $set: {body : req.body.body}
                }, function(err) {
                    if (err) {
                        throw err;
                    }
                    db.client.close();
                    res.status(201).json();
                });
    },
    findDoc: async function findDoc(req, res) {
        const db = await database.getDb();
        const col = db.collection;
        result = await col.findOne({
            _id: ObjectId(req.params.id)
        }, (err, data) => {
            if (err) {
                throw err;
            }
            db.client.close();
            res.status(201).json(data);
        })
    }
};

module.exports = database;