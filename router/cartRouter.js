const express = require('express');
const router = express.Router();

var cartPurchaseCRUD = require('../lib/cartPurchaseCRUD');

router.get('/cartview', (req, res) => { 
    cartPurchaseCRUD.cartview(req, res); 
});

router.get('/cartupdate/:cart_id', (req, res) => { 
    cartPurchaseCRUD.cartupdate(req, res); 
});

router.post('/cartupdate_process', (req, res) => { 
    cartPurchaseCRUD.cartupdate_process(req, res); 
});

router.get('/cartdelete/:cart_id', (req, res) => { 
    cartPurchaseCRUD.cartdelete_process(req, res); 
});

router.get('/purchaseview', (req, res) => { 
    cartPurchaseCRUD.purchaseview(req, res); 
});

router.get('/purchaseupdate/:purchase_id', (req, res) => { 
    cartPurchaseCRUD.purchaseupdate(req, res); 
});

router.post('/purchaseupdate_process', (req, res) => { 
    cartPurchaseCRUD.purchaseupdate_process(req, res); 
});

router.get('/purchasedelete/:purchase_id', (req, res) => { 
    cartPurchaseCRUD.purchasedelete_process(req, res); 
});

module.exports = router;