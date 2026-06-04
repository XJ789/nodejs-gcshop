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
    home: (req, res) => {
        var {name, login, cls} = authIsOwner(req,res);
        var sql = `SELECT * FROM product; SELECT * FROM boardtype; SELECT * FROM code;`;
        db.query(sql, (err, results) => {
            var products = results[0];
            var boardtypes = results[1];
            var codes = results[2];
            var context = {
                who : name,
                login : login,
                body : 'product.ejs',
                cls : cls,
                products: products,
                boardtypes: boardtypes,
                codes: codes,
                isRoot: true
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html); 
            } );
        });
     },

    categoryview: (req, res) => {
        var categ = req.params.categ; 
        
        var mainId = categ.substring(0, 4);
        var subId = categ.substring(4, 8);

        db.query(`SELECT * FROM code`, (err, codes) => {
            if (err) throw err;
            
            db.query(`SELECT * FROM product WHERE main_id = ? AND sub_id = ?`, [mainId, subId], (err2, products) => {
                if (err2) throw err2;
                
                db.query(`SELECT * FROM boardtype`, (err3, boardtypes) => {
                    if (err3) throw err3;

                    var context = {
                        who: req.session && req.session.name ? req.session.name : 'Guest',
                        login: req.session && req.session.is_logined ? req.session.is_logined : false,
                        cls: req.session && req.session.cls ? req.session.cls : 'NON',
                        body: 'product.ejs',
                        codes: codes,           
                        boardtypes: boardtypes, 
                        products: products,     
                        isRoot: true          
                    };
                    res.render('mainFrame', context);
                });
            });
        });
    },
    search: (req, res) => {
        var {name, login, cls} = authIsOwner(req,res);
        var searchKw = req.body.search || ''; 
        var kw = `%${searchKw}%`;
        
        var sql = `
            SELECT * FROM product WHERE name LIKE ? OR brand LIKE ? OR supplier LIKE ?;
            SELECT * FROM boardtype; 
            SELECT * FROM code;
        `;
        
        db.query(sql, [kw, kw, kw], (err, results) => {
            if (err) throw err;
            var context = {
                who : name, login : login, cls : cls, body : 'product.ejs',
                products: results[0],
                boardtypes: results[1],
                codes: results[2],
                isRoot: true
            };
            res.render('mainFrame', context);
        });
    },
    detail: (req, res) => {
        var {name, login, cls} = authIsOwner(req,res);
        var prod_id = req.params.prod_id;
        
        var sql = `
            SELECT * FROM product WHERE prod_id = ?; 
            SELECT * FROM boardtype; 
            SELECT * FROM code;
        `;
        
        db.query(sql, [prod_id], (err, results) => {
            if (err) throw err;
            var context = {
                who : name, login : login, cls : cls, 
                body : 'productDetail.ejs',
                product: results[0][0],
                boardtypes: results[1],
                codes: results[2]
            };
            res.render('mainFrame', context);
        });
    }
};