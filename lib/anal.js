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
    customer: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        if (!login || cls !== 'CEO') return res.redirect('/');

        var sqlAnal = `
            SELECT address, ROUND((COUNT(*) / (SELECT COUNT(*) FROM person)) * 100, 2) AS rate 
            FROM person 
            GROUP BY address;
        `;
        var sqlCommon = `SELECT * FROM boardtype; SELECT * FROM code;`;

        db.query(sqlAnal + sqlCommon, (err, results) => {
            if (err) throw err;
            var context = {
                who: name, login: login, cls: cls,
                body: 'analCustomer.ejs', 
                percentage: results[0],  
                boardtypes: results[1],
                codes: results[2]
            };
            res.render('mainFrame', context);
        });
    }
};