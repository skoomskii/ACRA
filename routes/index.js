const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Home
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {user: req.user})
);

// Create Record
router.get('/create_record', ensureAuthenticated, (req, res) => res.render('create_record'));

// Manual Record Entry
router.get('/manual', ensureAuthenticated, (req, res) => res.render('manual'));

// Manual Save
router.get('/save', ensureAuthenticated, (req, res) => {
    req.flash('success_msg');
    res.locals.message = req.flash();
    res.render('create_record')
});

// Public Failed Search
router.get('/search_fail', (req, res) => {
    req.flash('error_msg');
    res.locals.message = req.flash();
    res.render('welcome');
});

// Admin Failed Search
router.get('/search__fail', ensureAuthenticated, (req, res) => {
    req.flash('error_msg');
    res.locals.message = req.flash();
    res.render('dashboard', { user: req.user });
});

// Manual Duplication
router.get('/manual_duplicate', ensureAuthenticated, (req, res) => {
    req.flash('error_msg');
    res.locals.message = req.flash();
    res.render('manual');
});

// Automatic Record Entry
router.get('/auto', ensureAuthenticated, (req, res) => res.render('auto'));

// Automatic Duplication
router.get('/automatic_duplicate', ensureAuthenticated, (req, res) => {
    req.flash('error_msg');
    res.locals.message = req.flash();
    res.render('auto');
});

module.exports = router;