const database = require('../db/database');
const bcrypt = require('bcryptjs');
const e = require('express');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const collectionName = "users";

const auth = {
    register: async function register(req, res) {
        let db;
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return;
        }

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            try {
                db = await database.getDb("users");
                const col = db.collection;
                let data;

                data = await col.insertOne({
                    email: email,
                    password: hash
                });

                if (data) {
                    return res.status(201).json({msg: "User created"});
                }
            } catch(e) {
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
    },
    compareLogin: async function compareLogin(res, user, password) {
        bcrypt.compare(password, user.password, function(err, bres) {
            if (err) {
                return bres.status(500).json({
                    errors: {
                        status: 500,
                        source: "/auth/login",
                        title: "Bcrypt error",
                        detail: err.message
                    }
                });
            }

            if (bres) {
                const payload = { email: user.email };
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                return res.status(200).json({
                    data: {
                        status: 200,
                        title: "Login succeeded",
                        email: user.email,
                        token: token 
                    }
                });
            }
            return res.status(401).json({
                errors: {
                    status: 401,
                    title: "Login failed",
                    detail: "Incorrect password"
                }
            });
        });
    },
    login: async function login(req, res) {
        let db;
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(401).json({
                data: {
                    status: 401,
                    title: "Invalid email-password"
                }
            });
        }

        try {
            db = await database.getDb(collectionName);
            const col = db.collection;
            const data = await col.findOne({email: email});
            console.log(data);
            if (data) {
                return auth.compareLogin(res, data, password);
            } else {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/auth/login",
                        title: "Invalid email-password combo"
                    }
                })
            }
        } catch(e) {
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
    checkToken: async function checkToken(req, res, next) {
        const token = req.headers['x-access-token'];

        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/auth",
                        title: "Database error",
                        detail: "Invalid or missing token"
                    }
                });
            }
            req.user = {}
            req.user.email = decoded.email;
            return next();
        });
    }
}

module.exports = auth;