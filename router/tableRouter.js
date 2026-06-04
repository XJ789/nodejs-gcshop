const express = require('express');
const router = express.Router();
const table = require('../lib/table');

router.get('/', (req, res) => {
    table.tableList(req, res);
});

router.get('/view/:tableName', (req, res) => {
    table.tableView(req, res);
});

module.exports = router;