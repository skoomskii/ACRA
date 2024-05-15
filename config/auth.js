module.exports = {
  ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) { return next();}
        req.flash('error_msg', 'Log In');
        res.redirect('/users/login');
    },
  forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) { return next();}
      res.redirect('/dashboard');     
    }
};