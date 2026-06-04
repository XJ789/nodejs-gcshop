const db = require('./db');

function authIsOwner(req, res) {
    var name = 'Guest';
    var login = false;
    var cls = 'NON';
    if (req.session.is_logined) {
        name = req.session.name;
        login = true;
        cls = req.session.cls;
    }
    return {name,login, cls};
}

module.exports = {
    view: (req, res) => {
        var {name, login, cls} = authIsOwner(req,res);
        db.query(`SELECT * FROM code; SELECT * FROM boardtype;`, (err, results) => {
            if (err) {
                throw err;
            }
            var codes = results[0];
            var boardtypes = results[1];
            var context = {
                who : name,
                login : login,
                cls : cls,
                body : 'code.ejs',
                codes : codes,
                boardtypes: boardtypes
            };
            res.render('mainFrame', context);
        });
     },
    create: (req, res) => {
        var {name, login, cls} = authIsOwner(req,res);
        db.query(`SELECT * FROM boardtype; SELECT * FROM code;`, (err, results) => {
            if (err) {
                throw err;
            }
            var boardtypes = results[0];
            var codes = results[1];
            var context = {
                who : name,
                login : login,
                cls : cls,
                body : 'codeCU.ejs',
                isUpdate : false,
                code: {},
                boardtypes: boardtypes,
                codes: codes
            };
            res.render('mainFrame', context);
        });
    },
    create_process: (req, res) => {
        var post = req.body;
        db.query(`INSERT INTO code (main_id, sub_id, main_name, sub_name, start, end) VALUES (?, ?, ?, ?, ?, ?)`, [post.main_id, post.sub_id, post.main_name, post.sub_name, post.start, post.end], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/code/view');
        });
     },
    update: (req, res) => {
        var {name, login, cls} = authIsOwner(req,res);
        var {main, sub, start, end} = req.query;
        db.query(`SELECT * FROM code WHERE main_id = ? AND sub_id = ? AND start = ?; SELECT * FROM boardtype; SELECT * FROM code;`, [main, sub, start], (err, results) => {
            if (err) {
                throw err;
            }
            var context = {
                who : name,
                login : login,
                cls : cls,
                body : 'codeCU.ejs',
                isUpdate : true,
                code: results[0][0],
                boardtypes: results[1],
                codes: results[2]
            };
            res.render('mainFrame', context);
        });
    },
    update_process: (req, res) => {
        var post = req.body;
        db.query(`UPDATE code SET main_name=?, sub_name=?, end=? WHERE main_id=? AND sub_id=? AND start=?`, [post.main_name, post.sub_name, post.end, post.main_id, post.sub_id, post.start], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/code/view');
        });
    },
    delete_process: (req, res) => {
        var {main, sub, start, end} = req.query;
        db.query(`DELETE FROM code WHERE main_id=? AND sub_id=? AND start=?`, [main, sub, start], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/code/view');
        });
    }
}