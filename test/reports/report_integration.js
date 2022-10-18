/* global it describe */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

chai.should();

const database = require("../../db/database.js");
const collectionName = "docs";

chai.use(chaiHttp);

describe('Documents', () => {
    before(() => { // eslint-disable-line
        // dirty fix for fixing 'before' is not defined
        async (resolve) => {
            const db = await database.getDb(collectionName);

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function(info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function(err) {
                    console.error(err);
                })
                .finally(async function() {
                    await db.client.close();
                    resolve();
                });
        };
    });

    describe('GET /docs', () => {
        it('should get all documents and return status 200', (done) => {
            chai.request(server)
                .get("/docs")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);

                    done();
                });
        });
    });

    describe('POST /docs/create', () => {
        it('should create a new document and return status 201', (done) => {
            chai.request(server)
                .post("/docs/create")
                .send({
                    title: "A new title!",
                    body: "A new sentence!"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('GET /docs/seldoc/:id', () => {
        it('should find a single document by id and return status 200', (done) => {
            chai.request(server)
                .get("/docs/seldoc/testid")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('PUT /docs/update', () => {
        it('should update an existing document and return status 204', (done) => {
            chai.request(server)
                .put("/docs/update")
                .send({
                    body: "An update sentence!"
                })
                .end((err, res) => {
                    res.should.have.status(204);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });
});
