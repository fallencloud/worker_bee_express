//dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

//Initialize the app
const app = express();

// Load routes
const employees = require('./routes/employees');
const admins = require('./routes/admins');

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//Static assets
app.use(express.static(__dirname + '/views'));

//Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

//allow form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// method-override middleware
app.use(methodOverride('_method'));

// express-session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Passport middleware
//must be after express session
app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware
app.use(flash());

//Global variables for messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// @route   GET /
// @desc    Shows the landing page
// @access  Public
app.get('/', (req, res) => {
  //render method displays a template
  res.render('index');
});

//use routes
app.use('/employees', employees);
app.use('/admins', admins);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
