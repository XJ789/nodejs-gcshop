const { log } = require('node:console');
var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req) {
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
    login: (req, res) => {
        var {name, login, cls} = authIsOwner(req);

        db.query(`SELECT * FROM boardtype; SELECT * FROM code;`, (err, results) => {
            if (err) {
                throw err;
            }
            var boardtypes = results[0];
            var codes = results[1];
            var context = {
                who : name,
                login : login,
                body : 'login.ejs',
                cls : cls,
                boardtypes: boardtypes,
                codes: codes
            };
            req.app.render('mainFrame', context, (err, html) => {
                res.end(html); 
            });
        });
     },
login_process: (req, res) => {
    var post = req.body;
    var sntzedLoginid = sanitizeHtml(post.loginid);
    var sntzedPassword = sanitizeHtml(post.password);

    db.query(`select count(*) as num from person WHERE loginid = ? and password = ?`, [sntzedLoginid, sntzedPassword], (err, results) => {
        if (results[0].num === 1) {
            db.query(`select name, class, loginid FROM person WHERE loginid = ? and password = ?`, [sntzedLoginid, sntzedPassword], (err2, result) => {
                req.session.is_logined = true;
                req.session.loginid = result[0].loginid;
                req.session.name = result[0].name;
                req.session.cls = result[0].class;
                req.session.save(() => {res.redirect('/');});
            });
        } else {
            req.session.is_logined = false;
            req.session.name = 'Guest';
            req.session.cls = 'NON';
            req.session.save(() => {res.redirect('/');});
        }
    });
},
logout_process: (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}
}