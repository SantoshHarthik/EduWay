const jwt = require('jsonwebtoken');
const User = require('../models/User');



const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'secret key', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else { 
        // console.log(decodedToken.id);
        next();
      }
    });
  } else {
    res.redirect(`/login`);
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'secret key', async (err, decodedToken) => {
      if (err) {
        res.locals.admin = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.admin = user;  
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };