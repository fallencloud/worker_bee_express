const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../heleprs/auth');

// Load Empoyee Model
require('../models/Employees');
const Employee = mongoose.model('employees');

// @route   GET /employee
// @desc    Provides a list of all employees
// @access  Private
router.get('/', ensureAuthenticated, (req, res) => {
  const errors = [];

  Employee.find({ user: req.user.id })
    .then(employees => {
      if (employees.length <= 0) {
        errors.push({ text: 'No employees found' });
        res.render('employees/index', { errors });
      } else {
        res.render('employees/index', { employees });
      }
    })
    .catch(err => {
      console.error(err);
    });
});

// @route   GET /employees/add-employee
// @desc    Show add-employee form
// @access  Private
router.get('/add-employee', ensureAuthenticated, (req, res) => {
  res.render('employees/add-employee');
});

// @route   POST /employees
// @desc    Adds a new employee
// @access  Private
router.post('/', ensureAuthenticated, (req, res) => {
  const { name, email, phone } = req.body;
  const newEmp = {
    name,
    email,
    phone,
    user: req.user.id
  };

  new Employee(newEmp).save().then(emp => {
    //flash msg before redirect
    req.flash('success_msg', 'Employee added');
    res.redirect('/employees');
  });
});

// @route   GET /employees/edit-employee/:id
// @desc    Show edit-employee form
// @access  Private
router.get('/edit-employee/:id', ensureAuthenticated, (req, res) => {
  Employee.findOne({
    _id: req.params.id
  }).then(employee => {
    if (employee.user != req.user.id) {
      req.flash('error_msg', 'Not authorized');
      res.redirect('/employees');
    } else {
      res.render('employees/edit-employee', { employee });
    }
  });
});

// @route   PUT /employees/:id
// @desc    Update an employee's information
// @access  Private
router.put('/:id', ensureAuthenticated, (req, res) => {
  Employee.findOne({
    _id: req.params.id
  }).then(emp => {
    const { name, email, phone } = req.body;

    emp.name = name;
    emp.email = email;
    emp.phone = phone;

    emp.save().then(employee => {
      //flash msg before redirect
      req.flash('success_msg', 'Empoyee info updated');
      res.redirect('/employees');
    });
  });
});

// @route   DELETE /employees/:id
// @desc    Delete an employee
// @access  Private
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Employee.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.redirect('/employees');
  });
});

module.exports = router;
