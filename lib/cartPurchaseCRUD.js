const db = require('./db');

function authIsOwner(req, res) {
    var name = 'Guest';
    var login = false;
    var cls = 'NON';
    var loginid = '';
    if (req.session && req.session.is_logined) {
        name = req.session.name;
        login = true;
        cls = req.session.cls;
        loginid = req.session.loginid;
    }
    return { name, login, cls, loginid };
}

module.exports = {
    cartview: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        if (!login || (cls !== 'MNG' && cls !== 'CEO')) return res.redirect('/');
        
        var sql = `
            SELECT c.*, p.name as user_name, pr.name as prod_name 
            FROM cart c 
            JOIN person p ON c.loginid = p.loginid 
            JOIN product pr ON c.prod_id = pr.prod_id 
            ORDER BY c.date DESC;
            SELECT * FROM boardtype; SELECT * FROM code;
        `;
        db.query(sql, (err, results) => {
            if (err) throw err;
            var context = {
                who: name, login: login, cls: cls, body: 'cartView.ejs',
                carts: results[0], boardtypes: results[1], codes: results[2]
            };
            res.render('mainFrame', context);
        });
    },

    cartupdate: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        if (!login || (cls !== 'MNG' && cls !== 'CEO')) return res.redirect('/');
        
        var sql = `
            SELECT * FROM cart WHERE cart_id = ?;
            SELECT * FROM person;
            SELECT * FROM product;
            SELECT * FROM boardtype; 
            SELECT * FROM code;
        `;
        db.query(sql, [req.params.cart_id], (err, results) => {
            if (err) throw err;
            var context = {
                who: name, login: login, cls: cls, body: 'cartU.ejs',
                cart: results[0][0], persons: results[1], products: results[2],
                boardtypes: results[3], codes: results[4]
            };
            res.render('mainFrame', context);
        });
    },

    cartupdate_process: (req, res) => {
        var { login, cls } = authIsOwner(req, res);
        if (!login || (cls !== 'MNG' && cls !== 'CEO')) return res.redirect('/');
        
        var post = req.body;
        db.query(`UPDATE cart SET loginid = ?, prod_id = ? WHERE cart_id = ?`, 
            [post.loginid, post.prod_id, post.cart_id], (err) => {
            if (err) throw err;
            res.redirect('/cartView');
        });
    },

    cartdelete_process: (req, res) => {
        var { login, cls } = authIsOwner(req, res);
        if (!login || (cls !== 'MNG' && cls !== 'CEO')) return res.redirect('/');
        
        db.query(`DELETE FROM cart WHERE cart_id = ?`, [req.params.cart_id], (err) => {
            if (err) throw err;
            res.redirect('/cartView');
        });
    },

    purchaseview: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        if (!login || (cls !== 'MNG' && cls !== 'CEO')) return res.redirect('/');
        
        var sql = `
            SELECT p.*, per.name as user_name, pr.name as prod_name 
            FROM purchase p 
            JOIN person per ON p.loginid = per.loginid 
            JOIN product pr ON p.prod_id = pr.prod_id 
            ORDER BY p.date DESC;
            SELECT * FROM boardtype; SELECT * FROM code;
        `;
        db.query(sql, (err, results) => {
            if (err) throw err;
            var context = {
                who: name, login: login, cls: cls, body: 'purchaseView.ejs',
                purchases: results[0], boardtypes: results[1], codes: results[2]
            };
            res.render('mainFrame', context);
        });
    },

    purchaseupdate: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        if (!login || (cls !== 'MNG' && cls !== 'CEO')) return res.redirect('/');
        
        var sql = `
            SELECT * FROM purchase WHERE purchase_id = ?;
            SELECT * FROM person;
            SELECT * FROM product;
            SELECT * FROM boardtype; 
            SELECT * FROM code;
        `;
        db.query(sql, [req.params.purchase_id], (err, results) => {
            if (err) throw err;
            var context = {
                who: name, login: login, cls: cls, body: 'purchaseU.ejs',
                purchase: results[0][0], persons: results[1], products: results[2],
                boardtypes: results[3], codes: results[4]
            };
            res.render('mainFrame', context);
        });
    },

    purchaseupdate_process: (req, res) => {
        var { login, cls } = authIsOwner(req, res);
        if (!login || (cls !== 'MNG' && cls !== 'CEO')) return res.redirect('/');
        
        var post = req.body;
        var sql = `UPDATE purchase SET loginid=?, prod_id=?, price=?, point=?, qty=?, total=?, payYN=?, cancel=? WHERE purchase_id=?`;
        
        db.query(sql, [
            post.loginid, post.prod_id, post.price, post.point, 
            post.qty, post.total, post.payYN, post.cancel, post.purchase_id
        ], (err) => {
            if (err) throw err;
            res.redirect('/purchaseview');
        });
    },

    purchasedelete_process: (req, res) => {
        var { login, cls } = authIsOwner(req, res);
        if (!login || (cls !== 'MNG' && cls !== 'CEO')) return res.redirect('/');
        
        db.query(`DELETE FROM purchase WHERE purchase_id = ?`, [req.params.purchase_id], (err) => {
            if (err) throw err;
            res.redirect('/purchaseview');
        });
    }
};