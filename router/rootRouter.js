const express = require('express');
const router = express.Router();

var root = require('../lib/root');

router.get('/', (req, res) => {
    root.home(req, res);
});

router.get('/category/:categ', (req, res) => {
    root.categoryview(req, res);
});

router.post('/search', (req, res) => {
    root.search(req, res);
});

router.get('/detail/:prod_id', (req, res) => {
    root.detail(req, res);
});

module.exports = router;