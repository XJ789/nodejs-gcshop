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
        db.query(`SELECT * FROM person; SELECT * FROM boardtype; SELECT * FROM code;`, (err, results) => {
            if (err) {
                throw err;
            }
            var persons = results[0];
            var boardtypes = results[1];
            var codes = results[2];
            var context = {
                who : name,
                login : login,
                cls : cls,
                body : 'person.ejs',
                persons: persons,
                boardtypes: boardtypes,
                codes: codes
            };
            res.render('mainFrame', context);
        });
     },
    create: (req, res) => {
        var {name, login, cls} = authIsOwner(req,res);
        db.query(`SELECT * FROM boardtype; SELECT * FROM code;`, (err, results) => {
            var boardtypes = results[0];
            var codes = results[1];
            var context = {
                who : name,
                login : login,
                cls : cls,
                body : 'personCU.ejs',
                isUpdate : false,
                person: {},
                boardtypes: boardtypes,
                codes: codes
            };
            res.render('mainFrame', context);
        });
    },
    create_process: (req, res) => {
        var post = req.body;
        db.query(`INSERT INTO person (loginid, password, name, mf, address, tel, birth, class) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [post.loginid, post.password, post.name, post.mf, post.address, post.tel, post.birth, post.class || 'CST'], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/person/view');
        });
     },
    update: (req, res) => {
        var {name, login, cls} = authIsOwner(req,res);
        var {loginid} = req.params;
        db.query(`SELECT * FROM person WHERE loginid = ?; SELECT * FROM boardtype; SELECT * FROM code;`, [loginid], (err, results) => {
            if (err) {
                throw err;
            }
            var persons = results[0];
            var boardtypes = results[1];
            var codes = results[2];
            var context = {
                who : name,
                login : login,
                cls : cls,
                body : 'personCU.ejs',
                isUpdate : true,
                person: persons[0],
                boardtypes: boardtypes,
                codes: codes
            };
            res.render('mainFrame', context);
        });
    },
    update_process: (req, res) => {
        var post = req.body;
        db.query(`UPDATE person SET password=?, name=?, mf=?, address=?, tel=?, birth=?, class=? WHERE loginid=?`, [post.password, post.name, post.mf, post.address, post.tel, post.birth, post.class, post.loginid], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/person/view');
        });
    },
    delete_process: (req, res) => {
        var {loginid} = req.params;
        db.query(`DELETE FROM person WHERE loginid=?`, [loginid], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/person/view');
        });
    }
}