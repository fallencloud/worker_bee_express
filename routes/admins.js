const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

//import Admin model
require('../models/Admins');
const Admin = mongoose.model('admins');

// @route   GET /admins/login
// @desc    Shows the login page
// @access  Public
router.get('/login', (req, res) => {
  res.render('admins/login');
});

// @route   POST /admins/login
// @desc    Allows an admin to login
// @access  Public
router.post('/login', (req, res, next) => {
  const errors = [];
  const { email, password } = req.body;

  //check for errors
  if (!email) {
    errors.push({ text: 'Email address required' });
  }

  if (!password) {
    errors.push({ text: 'Password required' });
  }

  //if we have errors

  if (errors.length > 0) {
    //rerender the form
    //display the errors
    res.render('admins/login', { errors });
  } else {
    //passport authentication
    passport.authenticate('local', {
      successRedirect: '/employees',
      failureRedirect: '/admins/login',
      failureFlash: true
    })(req, res, next);
  }
});

// @route   GET /admins/register
// @desc    Shows the register page
// @access  Public
router.get('/register', (req, res) => {
  res.render('admins/register');
});

// @route   POST /admins/register
// @desc    Adds a new admin
// @access  Public
router.post('/register', (req, res) => {
  let errors = [];

  const { name, email, phone, password, password2 } = req.body;

  //server side validation
  if (!name || !email || !phone || !password || !password2) {
    errors.push({ text: 'All fields required' });
  }

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('admins/register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //no duplicate emails
    Admin.findOne({ email }).then(admin => {
      if (admin) {
        errors.push({ text: 'Email address already in use' });
        res.render('admins/register', {
          errors,
          name,
          email,
          phone,
          password,
          password2
        });
      } else {
        //create a new user
        const newAdmin = new Admin({
          name,
          email,
          phone,
          password
        });

        //encrypt password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            //replace with hashed pw
            newAdmin.password = hash;

            newAdmin
              .save()
              .then(admin => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/admins/login');
              })
              .catch(err => {
                console.error(err);
                return;
              });
          });
        });
      }
    });
  }
});

// @route   GET /admins/logout
// @desc    Logs the user out
// @access  Public
//Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admins/login');
});

module.exports = router;
