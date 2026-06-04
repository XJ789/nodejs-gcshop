const express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb2026'
};
var sessionStore = new MySQLStore(options);
const app = express();
app.use(session({
    secret: 'keybord cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const rootRouter = require('./router/rootRouter');
const authorRouter = require('./router/authorRouter');
const codeRouter = require('./router/codeRouter');
const personRouter = require('./router/personRouter');
const productRouter = require('./router/productRouter');
const boardRouter = require('./router/boardRouter');
const purchaseRouter = require('./router/purchaseRouter');
const cartRouter = require('./router/cartRouter');
const tableRouter = require('./router/tableRouter');
const analRouter = require('./router/analRouter');

app.use('/', rootRouter);
app.use('/auth', authorRouter);
app.use('/code', codeRouter);
app.use('/person', personRouter);
app.use('/board', boardRouter);
app.use('/product', productRouter);
app.use('/purchase', purchaseRouter);
app.use('/', cartRouter);
app.use('/table', tableRouter);
app.use('/anal', analRouter);

app.get('/favicon.ico', (req, res) => res.sendStatus(404));
app.listen(3000, () => console.log('Example app listening on port 3000!'));