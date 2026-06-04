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

function getCurrentDate() {
    var d = new Date();
    return `${d.getFullYear()}.${('0'+(d.getMonth()+1)).slice(-2)}.${('0'+d.getDate()).slice(-2)}: ${('0'+d.getHours()).slice(-2)}시 ${('0'+d.getMinutes()).slice(-2)}분 ${('0'+d.getSeconds()).slice(-2)}초`;
}

module.exports = {
    detail: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        var prod_id = req.params.prod_id;

        var sql = `
            SELECT * FROM product WHERE prod_id = ?; 
            SELECT * FROM boardtype; 
            SELECT * FROM code;
        `;
        db.query(sql, [prod_id], (err, results) => {
            if (err) throw err;
            var context = {
                who: name, login: login, cls: cls,
                body: 'purchaseDetail.ejs',
                product: results[0][0],
                boardtypes: results[1],
                codes: results[2]
            };
            res.render('mainFrame', context);
        });
    },

    cart_process: (req, res) => {
        var { login, loginid } = authIsOwner(req, res);
        if (!login) return res.redirect('/auth/login'); 

        var prod_id = req.body.prod_id;

        db.query(`SELECT * FROM cart WHERE loginid = ? AND prod_id = ?`, [loginid, prod_id], (err, results) => {
            if (err) throw err;
            
            if (results.length > 0) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<script>alert('장바구니에 이미 있는 제품입니다.'); location.href='/purchase/cart';</script>`);
            } else {
                var dateStr = getCurrentDate();
                db.query(`INSERT INTO cart (loginid, prod_id, date) VALUES (?, ?, ?)`, 
                    [loginid, prod_id, dateStr], (err2, result) => {
                    if (err2) throw err2;
                    res.redirect('/purchase/cart');
                });
            }
        });
    },

    cart: (req, res) => {
        var { name, login, cls, loginid } = authIsOwner(req, res);
        if (!login) return res.redirect('/auth/login');

        var sql = `
            SELECT c.cart_id, c.loginid, c.prod_id, c.date, p.name as prod_name, p.price, p.image
            FROM cart c INNER JOIN product p ON c.prod_id = p.prod_id
            WHERE c.loginid = ?;
            SELECT * FROM boardtype;
            SELECT * FROM code;
        `;
        db.query(sql, [loginid], (err, results) => {
            if (err) throw err;
            var context = {
                who: name, login: login, cls: cls,
                body: 'cart.ejs',
                cartItems: results[0], 
                boardtypes: results[1],
                codes: results[2]
            };
            res.render('mainFrame', context);
        });
    },
    purchase_process: (req, res) => {
        var { loginid } = authIsOwner(req, res);
        var post = req.body;
        var prod_id = post.prod_id;
        var qty = parseInt(post.qty);
        
        db.query(`SELECT price FROM product WHERE prod_id = ?`, [prod_id], (err, results) => {
            if (err) throw err;
            var price = results[0].price;
            var total = price * qty;
            var point = Math.floor(total * 0.01);
            var dateStr = getCurrentDate();
            
            var sql = `INSERT INTO purchase (loginid, prod_id, date, price, point, qty, total, payYN, cancel) VALUES (?, ?, ?, ?, ?, ?, ?, 'Y', 'N')`;
            db.query(sql, [loginid, prod_id, dateStr, price, point, qty, total], (err2, result) => {
                if (err2) throw err2;
                res.redirect('/purchase');
            });
        });
    },

    cart_purchase_process: (req, res) => {
        var { loginid } = authIsOwner(req, res);
        var post = req.body;
        
        var checks = post.check;
        if (!checks) { 
            return res.send(`<script>alert('구매할 상품을 선택해 주세요'); location.href='/purchase/cart';</script>`);
        }
        if (!Array.isArray(checks)) { 
            checks = [checks]; 
        } 

        var completed = 0;
        
        checks.forEach(item => {
            var parts = item.split('|');
            var cart_id = parts[0];
            var prod_id = parts[1];
            var qty = parseInt(post[`qty_${cart_id}`]) || 1;

            db.query(`SELECT price FROM product WHERE prod_id = ?`, [prod_id], (err, results) => {
                if (err) throw err;
                
                var price = results[0].price;
                var total = price * qty;
                var point = Math.floor(total * 0.01);
                var dateStr = getCurrentDate();
                
                db.query(`INSERT INTO purchase (loginid, prod_id, date, price, point, qty, total, payYN, cancel) VALUES (?, ?, ?, ?, ?, ?, ?, 'Y', 'N')`, 
                    [loginid, prod_id, dateStr, price, point, qty, total], (err2) => {
                    if (err2) throw err2;
                    
                    db.query(`DELETE FROM cart WHERE cart_id = ?`, [cart_id], (err3) => {
                        if (err3) throw err3;
                        
                        completed++;
                        if (completed === checks.length) {
                            setTimeout(() => {
                                res.redirect('/purchase');
                            }, 50);
                        }
                    });
                });
            });
        });
    },

    cart_delete_process: (req, res) => {
        var { loginid } = authIsOwner(req, res);
        var checks = req.body.check;
        
        if (!checks) { 
            return res.send(`<script>alert('삭제할 상품을 선택해 주세요'); location.href='/purchase/cart';</script>`);
        }
        if (!Array.isArray(checks)) { 
            checks = [checks]; 
        }

        var completed = 0;
        
        checks.forEach(item => {
            var parts = item.split('|');
            var cart_id = parts[0]; 

            db.query(`DELETE FROM cart WHERE cart_id = ? AND loginid = ?`, [cart_id, loginid], (err) => {
                if (err) throw err;
                
                completed++;
                if (completed === checks.length) {
                    res.redirect('/purchase/cart');
                }
            });
        });
    },

    view: (req, res) => {
        var { name, login, cls, loginid } = authIsOwner(req, res);
        if (!login) return res.redirect('/auth/login');

        var sqlPurchase = '';
        var params = [];
        if (cls === 'CST') {
            sqlPurchase = `SELECT p.*, pr.name as prod_name, pr.image FROM purchase p JOIN product pr ON p.prod_id = pr.prod_id WHERE p.loginid = ? ORDER BY p.date DESC`;
            params.push(loginid);
        } else {
            sqlPurchase = `SELECT p.*, pr.name as prod_name, pr.image FROM purchase p JOIN product pr ON p.prod_id = pr.prod_id ORDER BY p.date DESC`;
        }

        db.query(sqlPurchase, params, (err, purchaseItems) => {
            if (err) throw err;
            db.query(`SELECT * FROM boardtype; SELECT * FROM code;`, (err2, results) => {
                var context = {
                    who: name, login: login, cls: cls, body: 'purchase.ejs',
                    purchases: purchaseItems,
                    boardtypes: results[0], codes: results[1]
                };
                res.render('mainFrame', context);
            });
        });
    },

    cancel: (req, res) => {
        var purchase_id = req.params.purchase_id;
        db.query(`UPDATE purchase SET cancel = 'Y' WHERE purchase_id = ?`, [purchase_id], (err) => {
            if (err) throw err;
            res.redirect('/purchase');
        });
    }
};