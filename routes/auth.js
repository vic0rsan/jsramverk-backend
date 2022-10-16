var express = require('express');
var router = express.Router();
const auth = require("../models/auth");

router.post('/register', async (req, res) => {
    await auth.register(req, res);
});

router.post('/login', async (req, res) => {
   await auth.login(req, res);
});

module.exports = router;