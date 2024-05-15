// import modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load data models
const User = require('../models/User');
const Case = require('../models/Case');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Public Search Record
router.get('/public_search', async (req, res) => {
        const { caseID } = await req.query;   
        const result = await Case.findOne({ CaseID: caseID });
    {
        if (result) { res.render('public_search', { data: result }); }
        else { res.redirect('/search_fail'); }
    }
});

// Admin Search Record
router.get('/search', ensureAuthenticated, async (req, res) => {
    const { caseID } = req.query;
    const result = await Case.findOne({ CaseID: caseID });
    {
        if (result) { res.render('admin_search', { data: result }); }
        else { res.redirect('/search__fail'); }
    }
});

// Automatic Entry
router.get('/auto', ensureAuthenticated, (req, res, next) => { res.redirect('/auto'); });
router.post('/automatic', ensureAuthenticated, async (req, res) => {
    const { CaseID, DoH, DoNH, PersonsPresent, StartoH, EndoH, Directions } = req.body;
    const result = await Case.findOne({ CaseID: CaseID });
    {
        if (result) { res.redirect('/automatic_duplicate'); }
        else {
            const newCase = new Case
                ({
                    CaseID,
                    DoH,
                    DoNH,
                    PersonsPresent,
                    StartoH,
                    EndoH,
                    Directions
                });
            newCase.save();
            res.redirect('/save');
        }
    }
});

// Manual Entry
router.get('/manual', ensureAuthenticated, (req, res) => res.render('manual'));
router.post('/manual', ensureAuthenticated, async (req, res) => {
    const { CaseID, DoH, DoNH, PersonsPresent, StartoH, EndoH, Directions } = req.body;
    const result = await Case.findOne({ CaseID: CaseID });
    {
        if (result) { res.redirect('/manual_duplicate'); }
        else
        {
            const newCase = new Case
                ({
                    CaseID,
                    DoH,
                    DoNH,
                    PersonsPresent,
                    StartoH,
                    EndoH,
                    Directions
                });
            newCase.save();
            res.redirect('/save');
        }
    }
});

// Edit Request
router.post('/request_edit', ensureAuthenticated, async (req, res) =>
{
    const result = await req.body;
    res.render('edit', { data: result });
});

// Edit Record
router.post('/edit', ensureAuthenticated, async (req, res) =>
{
    const { CaseID, DoH, DoNH, PersonsPresent, StartoH, EndoH, Directions } = await req.body;
    const result = await Case.findOne({ CaseID: CaseID });
    
    result.CaseID = CaseID;
    result.DoH = DoH;
    result.DoNH = DoNH;
    result.PersonsPresent = PersonsPresent;
    result.StartoH = StartoH;
    result.EndoH = EndoH;
    result.Directions = Directions;
    result.save();

    res.redirect('/save');
});

// Delete Record
router.post('/delete', ensureAuthenticated, async (req, res) => {
    const { CaseID } = await req.body;
    res.render('delete', { data: CaseID });
});

// Confirm Deletion
router.post('/confirm', ensureAuthenticated, async (req, res) => {
    const { caseID } = await req.body;
    await Case.findOneAndDelete({ CaseID: caseID }).then(res.redirect('/dashboard'));
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged Out');
    res.redirect('./login');
});

// Home
router.get('/', (req, res, next) => { res.redirect('/welcome'); });

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res, next) => { res.redirect('/dashboard'); });

// Create Record
router.get('/create_record', ensureAuthenticated, (req, res, next) => { res.redirect('/create_record'); });

// Manual Save
router.get('/save', ensureAuthenticated, (req, res, next) => { res.redirect('/save'); });

// Manual Duplication
router.get('/manual_duplicate', ensureAuthenticated, (req, res, next) => { res.redirect('/manual_duplicate'); });

// Automatic Duplication
router.get('/automatic_duplicate', ensureAuthenticated, (req, res, next) => { res.redirect('/automatic_duplicate'); });

module.exports = router;

//// Register Page
//router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

//// Register
//router.post('/register', (req, res) => {
//  const { username, password, password2 } = req.body;
//  let errors = [];

//  if (!username || !password || !password2) {
//    errors.push({ msg: 'Please enter all fields' });
//  }

//  if (password != password2) {
//    errors.push({ msg: 'Passwords do not match' });
//  }

//  if (password.length < 6) {
//    errors.push({ msg: 'Password must be at least 6 characters' });
//  }

//  if (errors.length > 0) {
//    res.render('register', {
//      errors,
//      username,
//      password,
//      password2
//    });
//  } else {
//    User.findOne({ username: username }).then(user => {
//      if (user) {
//        errors.push({ msg: 'User already exists' });
//        res.render('register', {
//          errors,
//          name,
//          username,
//          password,
//          password2
//        });
//      } else {
//        const newUser = new User({
//          username,
//          password
//        });

//        bcrypt.genSalt(10, (err, salt) => {
//          bcrypt.hash(newUser.password, salt, (err, hash) => {
//            if (err) throw err;
//            newUser.password = hash;
//            newUser
//              .save()
//              .then(user => {
//                req.flash(
//                  'success_msg',
//                  'You are now registered and can log in'
//                );
//                res.redirect('/users/login');
//              })
//              .catch(err => console.log(err));
//          });
//        });
//      }
//    });
//  }
//});