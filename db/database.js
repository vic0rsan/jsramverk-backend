const mongo = require("mongodb").MongoClient;
//const config = require("./config.json");
//const collectionName = "docs";

const database = {
    getDb: async function getDb(collectionName) {
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
    }
};

module.exports = database;
