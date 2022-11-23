const jwt = require('jsonwebtoken');
const student = require('../models/students');



const studentrequireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'secret key', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/studentlogin');
      } else {
        // console.log(decodedToken.id);
        next();
      }
    });
  } else {
    res.redirect('/studentlogin');
  }
};

// check current user
const studentcheckUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'secret key', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await student.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { studentrequireAuth, studentcheckUser };