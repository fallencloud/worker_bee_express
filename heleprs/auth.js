module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      //call the next function
      return next();
    }

    //otherwise
    //not authorized
    req.flash('error_msg', 'You must be logged in to view this page.');
    res.redirect('/admins/login');
  }
};
