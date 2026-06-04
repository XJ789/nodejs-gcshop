const db = require('./db');
const sanitizeHtml = require('sanitize-html');

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
    typeview: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        db.query(`SELECT * FROM boardtype; SELECT * FROM code;`, (err, results) => {
            if (err) throw err;
            var boardtypes = results[0];
            var codes = results[1];
            var context = {
                who: name, login: login, cls: cls,
                body: 'boardtype.ejs',
                boardtypes: boardtypes,
                codes: codes
            };
            res.render('mainFrame', context);
        });
    },
    typecreate: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        db.query(`SELECT * FROM boardtype; SELECT * FROM code;`, (err, results) => {
            var boardtypes = results[0];
            var codes = results[1];
            var context = {
                who: name, login: login, cls: cls,
                body: 'boardtypeCU.ejs',
                boardtypes: boardtypes,
                codes: codes,
                isUpdate: false,
                btype: {}
            };
            res.render('mainFrame', context);
        });
    },
    typecreate_process: (req, res) => {
        var post = req.body;
        db.query(`INSERT INTO boardtype (title, description, write_YN, re_YN, numPerPage) VALUES (?, ?, ?, ?, ?)`, 
            [post.title, post.description, post.write_YN, post.re_YN, post.numPerPage], (err, result) => {
            if (err) throw err;
            res.redirect('/board/type/view');
        });
    },
    typeupdate: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        var typeId = req.params.typeId;
        var sql1 = `SELECT * FROM boardtype; SELECT * FROM code; `;
        var sql2 = `SELECT * FROM boardtype WHERE type_id = ?; `;
        
        db.query(sql1 + sql2, [typeId], (err, results) => {
            if (err) throw err;
            var boardtypes = results[0];
            var codes = results[1];
            var context = {
                who: name, login: login, cls: cls,
                body: 'boardtypeCU.ejs',
                boardtypes: boardtypes,
                codes: codes,
                isUpdate: true,
                btype: results[2][0]
            };
            res.render('mainFrame', context);
        });
    },
    typeupdate_process: (req, res) => {
        var post = req.body;
        db.query(`UPDATE boardtype SET title=?, description=?, numPerPage=?, write_YN=?, re_YN=? WHERE type_id=?`, 
            [post.title, post.description, post.numPerPage, post.write_YN, post.re_YN, post.type_id], (err, result) => {
            if (err) throw err;
            res.redirect('/board/type/view');
        });
    },
    typedelete_process: (req, res) => {
        var typeId = req.params.typeId;
        db.query(`SELECT COUNT(*) as count FROM board WHERE type_id = ?`, [typeId], (err, results) => {
            if (err) throw err;
            if (results[0].count > 0) {
                return res.send(`<script>alert('해당 게시판에 게시글이 있어서 삭제할 수 없습니다.'); history.back();</script>`);
            }

            db.query(`DELETE FROM boardtype WHERE type_id=?`, [typeId], (err2, result) => {
                if (err2) {
                    if (err2.errno === 1451) {
                        return res.send(`<script>alert('해당 게시판에 게시글이 있어서 삭제할 수 없습니다.'); history.back();</script>`);
                    }
                    throw err2;
                }
                res.redirect('/board/type/view');
            });
        });
    },

    view: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        var sntzedTypeId = sanitizeHtml(req.params.typeId);
        var pNum = req.params.pNum;

        var sql1 = `SELECT * FROM boardtype; `;
        var sql2 = `SELECT * FROM boardtype WHERE type_id = ?; `;
        var sql3 = `SELECT count(*) as total FROM board WHERE type_id = ?; `;
        var sql_code = `SELECT * FROM code; `;

        db.query(sql1 + sql2 + sql3 + sql_code, [sntzedTypeId, sntzedTypeId], (error, results) => {
            if (error) throw error;
            
            var boardtypes = results[0];
            var currentType = results[1];
            var codes = results[3];
            
            var numPerPage = currentType[0].numPerPage;
            var offs = (pNum - 1) * numPerPage;
            var totalPages = Math.max(1, Math.ceil(results[2][0].total / numPerPage));

            var sql4 = `
                SELECT b.board_id as board_id, b.title as title, b.date as date, p.name as name, b.p_id as p_id,
                (SELECT COUNT(*) FROM board WHERE p_id = b.board_id) as reply_count
                FROM board b INNER JOIN person p ON b.loginid = p.loginid 
                WHERE b.type_id = ? 
                ORDER BY IF(b.p_id = 0, b.board_id, b.p_id) DESC, b.board_id ASC LIMIT ? OFFSET ?;
            `;

            db.query(sql4, [sntzedTypeId, Number(numPerPage), Number(offs)], (err, boards) => {
                if (err) throw err;
                var context = {
                    who: name, login: login, cls: cls,
                    body: 'board.ejs',
                    boardtypes: boardtypes,
                    codes: codes,
                    btname: currentType, 
                    boards: boards,
                    pNum: pNum,
                    totalPages: totalPages
                };
                res.render('mainFrame', context);
            });
        });
    },

    create: (req, res) => {
        var { name, login, cls, loginid } = authIsOwner(req, res);
        var typeId = req.params.typeId;

        var sql1 = `SELECT * FROM boardtype; SELECT * FROM code;`;
        var sql2 = `SELECT * FROM boardtype WHERE type_id = ?; `;
        
        db.query(sql1 + sql2, [typeId], (err, results) => {
            if (err) throw err;
            var context = {
                who: name, login: login, cls: cls, loginid: loginid,
                body: 'boardCRU.ejs',
                boardtypes: results[0],
                codes: results[1],
                btname: results[2],
                isUpdate: false,
                isDetail: false,
                board: {},
                pNum: 1
            };
            res.render('mainFrame', context);
        });
    },

    create_process: (req, res) => {
        var { loginid,cls } = authIsOwner(req, res);
        var post = req.body;
        var dateStr = getCurrentDate();

        var pwd = (cls === 'MNG') ? Math.random().toString(36).slice(-12) : post.password;

        db.query(`INSERT INTO board (type_id, p_id, loginid, password, title, date, content) VALUES (?, 0, ?, ?, ?, ?, ?)`, 
            [post.type_id, loginid, post.password, post.title, dateStr, post.content], (err, result) => {
            if (err) throw err;
            res.redirect(`/board/view/${post.type_id}/1`);
        });
    },

    detail: (req, res) => {
        var { name, login, cls, loginid } = authIsOwner(req, res);
        var boardId = req.params.boardId;
        var pNum = req.params.pNum;
        var hasAnswer = req.params.hasAnswer || 'N'; 

        var sql1 = `SELECT * FROM boardtype; SELECT * FROM code; `;
        var sql2 = `
            SELECT b.*, p.name as author_name 
            FROM board b INNER JOIN person p ON b.loginid = p.loginid 
            WHERE b.board_id = ?; 
        `;

        db.query(sql1 + sql2, [boardId], (err, results) => {
            if (err) throw err;
            var boardDetail = results[2][0];
            
            db.query(`SELECT * FROM boardtype WHERE type_id = ?`, [boardDetail.type_id], (err, typeResult) => {
                var context = {
                    who: name, login: login, cls: cls, loginid: loginid,
                    body: 'boardCRU.ejs',
                    boardtypes: results[0],
                    codes: results[1],
                    btname: typeResult,
                    isUpdate: false,
                    isDetail: true,
                    board: boardDetail,
                    pNum: pNum,
                    hasAnswer: hasAnswer 
                };
                res.render('mainFrame', context);
            });
        });
    },

    update: (req, res) => {
        var { name, login, cls, loginid } = authIsOwner(req, res);
        var boardId = req.params.boardId;
        var typeId = req.params.typeId;
        var pNum = req.params.pNum;

        var sql1 = `SELECT * FROM boardtype; SELECT * FROM code; `;
        var sql2 = `
            SELECT b.*, p.name as author_name 
            FROM board b INNER JOIN person p ON b.loginid = p.loginid 
            WHERE b.board_id = ?; 
        `;

        db.query(sql1 + sql2, [boardId], (err, results) => {
            if (err) throw err;
            var boardDetail = results[2][0];

            db.query(`SELECT * FROM boardtype WHERE type_id = ?`, [typeId], (err, typeResult) => {
                var context = {
                    who: name, login: login, cls: cls, loginid: loginid,
                    body: 'boardCRU.ejs',
                    boardtypes: results[0],
                    codes: results[1],
                    btname: typeResult,
                    isUpdate: true,
                    isDetail: false,
                    board: boardDetail,
                    pNum: pNum
                };
                res.render('mainFrame', context);
            });
        });
    },

    update_process: (req, res) => {
        var { cls } = authIsOwner(req, res);
        var post = req.body;
        
        db.query(`SELECT password FROM board WHERE board_id = ?`, [post.board_id], (err, results) => {
            if (err) throw err;
            var realPassword = results[0].password;

            if (cls === 'MNG' || post.password === realPassword) {
                db.query(`UPDATE board SET title=?, content=?, date=? WHERE board_id=?`, 
                    [post.title, post.content, post.date, post.board_id], (err, result) => {
                    if (err) throw err;
                    res.redirect(`/board/view/${post.type_id}/${post.pNum}`);
                });
            } else {
                var sntzedBoardId = sanitizeHtml(post.board_id);
                var sntzedTypeId = sanitizeHtml(post.type_id);
                var sntzedpNum = sanitizeHtml(post.pNum);

                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                res.end(`
                    <script language=JavaScript type="text/javascript">
                        alert("비밀번호가 일치하지 않습니다.");
                        setTimeout("location.href='http://localhost:3000/board/update/${sntzedBoardId}/${sntzedTypeId}/${sntzedpNum}/'", 1000);
                    </script>
                `);
            }
        });
    },

    delete_process: (req, res) => {
        var { cls } = authIsOwner(req, res);
        var boardId = req.params.boardId;
        var typeId = req.params.typeId;
        var pNum = req.params.pNum;

        db.query(`DELETE FROM board WHERE board_id=?`, [boardId], (err, result) => {
            if (err) throw err;
            res.redirect(`/board/view/${typeId}/${pNum}`);
        });
    },
    
    answer: (req, res) => {
        var { name, login, cls, loginid } = authIsOwner(req, res);
        if (!login || cls !== 'MNG') return res.redirect('/'); 
        
        var boardId = req.params.boardId;
        var pNum = req.params.pNum;

        var sql1 = `SELECT * FROM boardtype; SELECT * FROM code; `;
        var sql2 = `
            SELECT b.*, p.name as author_name 
            FROM board b INNER JOIN person p ON b.loginid = p.loginid 
            WHERE b.board_id = ?; 
        `;

        db.query(sql1 + sql2, [boardId], (err, results) => {
            if (err) throw err;
            var boardDetail = results[2][0];
            
            db.query(`SELECT * FROM boardtype WHERE type_id = ?`, [boardDetail.type_id], (err, typeResult) => {
                var context = {
                    who: name, login: login, cls: cls, loginid: loginid,
                    body: 'boardAnswer.ejs', 
                    boardtypes: results[0],
                    codes: results[1],
                    btname: typeResult,
                    board: boardDetail,
                    pNum: pNum
                };
                res.render('mainFrame', context);
            });
        });
    },

    answer_process: (req, res) => {
        var { loginid } = authIsOwner(req, res);
        var post = req.body;
        var dateStr = getCurrentDate();
        
        var answerTitle = `[답변]: ${post.title}`;

        db.query(`INSERT INTO board (type_id, p_id, loginid, password, title, date, content) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [post.type_id, post.board_id, loginid, 'admin', answerTitle, dateStr, post.content], (err, result) => {
            if (err) throw err;
            res.redirect(`/board/view/${post.type_id}/${post.pNum}`);
        });
    }
}