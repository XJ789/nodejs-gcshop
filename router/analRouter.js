const express = require('express');
const router = express.Router();
const anal = require('../lib/anal');

router.get('/customer', (req, res) => {
    anal.customer(req, res);
});

module.exports = router;