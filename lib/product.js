const { code } = require('statuses');
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
        db.query(`SELECT * FROM product; SELECT * FROM boardtype; SELECT * FROM code;`, (err, results) => {
            if (err) {
                throw err;
            }
            var products = results[0];
            var boardtypes = results[1];
            var codes = results[2];
            var context = {
                who : name,
                login : login,
                cls : cls,
                body : 'product.ejs',
                products: products,
                boardtypes: boardtypes,
                codes: codes
            };
            res.render('mainFrame', context);
        });
     },
    create: (req, res) => {
        var {name, login, cls} = authIsOwner(req,res);
        db.query(`SELECT * FROM code; SELECT * FROM boardtype;`, (err, results) => {
            var codes = results[0];
            var boardtypes = results[1];
            var context = {
                who : name,
                login : login,
                cls : cls,
                body : 'productCU.ejs',
                isUpdate : false,
                product: {},
                codes: codes,
                boardtypes: boardtypes
            };
            res.render('mainFrame', context);
        });
    },
    create_process: (req, res) => {
        var post = req.body;
        var imagePath = req.file ? `/images/${req.file.filename}` : '';
        var categ = post.category.split('_');
        var main_id = categ[0];
        var sub_id = categ[1];
        db.query(`INSERT INTO product (main_id, sub_id, name, price, stock, brand, supplier, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [main_id, sub_id, post.name, post.price, post.stock, post.brand, post.supplier, imagePath], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/product/view');
        });
     },
    update: (req, res) => {
        var {name, login, cls} = authIsOwner(req,res);
        var {prodid} = req.params;
        db.query(`SELECT * FROM product WHERE prod_id = ?`, [prodid], (err, products) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM code; SELECT * FROM boardtype;`, (err, results) => {
                var codes = results[0];
                var boardtypes = results[1];
                var context = {
                    who : name,
                    login : login,
                    cls : cls,
                    body : 'productCU.ejs',
                    isUpdate : true,
                    product: products[0],
                    codes: codes,
                    boardtypes: boardtypes
                };
                res.render('mainFrame', context);
            });
        });
    },
    update_process: (req, res) => {
        var post = req.body;
        var imagePath = req.file ? `/images/${req.file.filename}` : post.image;
        var categ = post.category.split('_');
        var main_id = categ[0];
        var sub_id = categ[1];
        db.query(`UPDATE product SET main_id=?, sub_id=?, name=?, price=?, stock=?, brand=?, supplier=?, image=? WHERE prod_id=?`, [main_id, sub_id, post.name, post.price, post.stock, post.brand, post.supplier, imagePath, post.prodid], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/product/view');
        });
    },
    delete_process: (req, res) => {
        var {prodid} = req.params;
        db.query(`DELETE FROM product WHERE prod_id=?`, [prodid], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/product/view');
        });
    }
}