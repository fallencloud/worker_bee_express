//dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//export schema
module.exports = Employee = mongoose.model('employees', EmployeeSchema);
