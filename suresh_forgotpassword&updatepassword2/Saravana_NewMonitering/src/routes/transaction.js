const nmp = require('../init.js');
const lang = nmp.lang;
const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

router.get('/', async (req, res, next) => {
    res.render('transaction', {
        lang: lang,
        activeTab: 'transaction',
        activeMenu: 'dashboard'
    });
});

router.get('/:status', check('status').trim().matches(/^[a-zA-Z]+$/), async (req, res, next) => {
    const status = req.params.status

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('/transaction');
    }

    res.render('transaction_' + status, {
        lang: lang,
        activeTab: 'transaction',
        activeMenu: status
    });
});

module.exports = router;
