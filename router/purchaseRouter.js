const express = require('express');
const router = express.Router();
const purchase = require('../lib/purchase');

router.get('/detail/:prod_id', (req, res) => {
    purchase.detail(req, res);
});

router.post('/cart_process', (req, res) => {
    purchase.cart_process(req, res);
});

router.get('/cart', (req, res) => {
    purchase.cart(req, res);
});

router.post('/purchase_process', (req, res) => { 
    purchase.purchase_process(req, res); 
});

router.post('/cart_purchase_process', (req, res) => { 
    purchase.cart_purchase_process(req, res); 
});

router.get('/', (req, res) => { 
    purchase.view(req, res); 
});

router.get('/cancel/:purchase_id', (req, res) => { 
    purchase.cancel(req, res); 
});

router.post('/cart_delete_process', (req, res) => { 
    purchase.cart_delete_process(req, res); 
});

module.exports = router;