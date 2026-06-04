const db = require('./db');

function authIsOwner(req, res) {
    var name = 'Guest';
    var login = false;
    var cls = 'NON';
    if (req.session && req.session.is_logined) {
        name = req.session.name;
        login = true;
        cls = req.session.cls;
    }
    return { name, login, cls };
}

module.exports = {
    tableList: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        if (!login || cls !== 'MNG') return res.redirect('/');

        var sqlTables = `
            SELECT TABLE_NAME as table_name, TABLE_COMMENT as table_comment 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = 'webdb2026' AND TABLE_TYPE = 'BASE TABLE';
        `;

        var sqlCommon = `SELECT * FROM boardtype; SELECT * FROM code;`;

        db.query(sqlTables + sqlCommon, (err, results) => {
            if (err) throw err;
            var context = {
                who: name, login: login, cls: cls,
                body: 'tableManage.ejs',
                tables: results[0],
                boardtypes: results[1],
                codes: results[2]
            };
            res.render('mainFrame', context);
        });
    },

    tableView: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        if (!login || cls !== 'MNG') return res.redirect('/');

        var tableName = req.params.tableName;

        var sqlColumns = `
            SELECT COLUMN_NAME as column_name, DATA_TYPE as data_type, COLUMN_COMMENT as column_comment 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'webdb2026' AND TABLE_NAME = ?;
        `;
        var sqlCommon = `SELECT * FROM boardtype; SELECT * FROM code;`;

        db.query(sqlColumns + sqlCommon, [tableName], (err, results) => {
            if (err) throw err;
            var columns = results[0];
            var boardtypes = results[1];
            var codes = results[2];

            db.query(`SELECT * FROM ??`, [tableName], (err2, rows) => {
                if (err2) throw err2;
                
                var context = {
                    who: name, login: login, cls: cls,
                    body: 'tableView.ejs',
                    tableName: tableName,
                    columns: columns,
                    rows: rows,
                    boardtypes: boardtypes,
                    codes: codes
                };
                res.render('mainFrame', context);
            });
        });
    }
};