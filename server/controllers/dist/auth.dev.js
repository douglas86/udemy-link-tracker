"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUpdateDeleteLink = exports.resetPassword = exports.forgetPassword = exports.adminMiddleWare = exports.authMiddleWare = exports.requireSignIn = exports.login = exports.registerActivated = exports.register = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _expressJwt = _interopRequireDefault(require("express-jwt"));

var _shortid = _interopRequireDefault(require("shortid"));

var _email = require("../helpers/email");

var _user = _interopRequireDefault(require("../models/user"));

var _link = _interopRequireDefault(require("../models/link"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require('dotenv').config();

_awsSdk["default"].config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

var ses = new _awsSdk["default"].SES({
  apiVersion: '2010-12-01'
});

var register = function register(req, res) {
  // console.log('REGISTER CONTROLLER', req.body);
  var _req$body = req.body,
      name = _req$body.name,
      email = _req$body.email,
      password = _req$body.password; // check if user exists in our db

  _user["default"].findOne({
    email: email
  }).exec(function (err, user) {
    if (user) {
      console.log(err);
      return res.status(400).json({
        error: 'Email is taken'
      });
    } // generate token with user name email and password


    var token = _jsonwebtoken["default"].sign({
      name: name,
      email: email,
      password: password
    }, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: '10m'
    }); // send email


    var params = (0, _email.registerEmailParams)(email, token);
    var sendEmailOnRegister = ses.sendEmail(params).promise();
    sendEmailOnRegister.then(function (data) {
      console.log('email submitted to SES', data);
      res.json({
        message: "Email has been sent to ".concat(email, ", Follow the instruction to complete your registration")
      });
    })["catch"](function (err) {
      console.log('ses email on register', err);
      res.json({
        message: "We could not verify your email, Please try again"
      });
    });
  });
};

exports.register = register;

var registerActivated = function registerActivated(req, res) {
  var token = req.body.token;
  console.log('body', req);
  console.log('token', token);

  _jsonwebtoken["default"].verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        error: 'Expired link. Try again'
      });
    }

    var _jwt$decode = _jsonwebtoken["default"].decode(token),
        name = _jwt$decode.name,
        email = _jwt$decode.email,
        password = _jwt$decode.password;

    var username = _shortid["default"].generate();

    _user["default"].findOne({
      email: email
    }).exec(function (err, user) {
      if (user) {
        return res.status(401).json({
          error: 'Email is taken'
        });
      } // register new user


      var newUser = new _user["default"]({
        username: username,
        name: name,
        email: email,
        password: password
      });
      newUser.save(function (err, user) {
        if (err) {
          return res.status(401).json({
            error: 'Error saving user in database, try later.'
          });
        }

        return res.json({
          message: 'Registration success. Please login.'
        });
      });
    });
  });
};

exports.registerActivated = registerActivated;

var login = function login(req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password; // console.table({ email, password });

  _user["default"].findOne({
    email: email
  }).exec(function (err, user) {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please register.'
      });
    } // authenticate


    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match'
      });
    } // generate token and send to client


    var token = _jsonwebtoken["default"].sign({
      _id: user._id
    }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    var _id = user._id,
        name = user.name,
        email = user.email,
        role = user.role;
    return res.json({
      token: token,
      user: {
        _id: _id,
        name: name,
        email: email,
        role: role
      }
    });
  });
}; // req.user


exports.login = login;
var requireSignIn = (0, _expressJwt["default"])({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
});
exports.requireSignIn = requireSignIn;

var authMiddleWare = function authMiddleWare(req, res, next) {
  var authUserId = req.user._id;

  _user["default"].findOne({
    _id: authUserId
  }).exec(function (err, user) {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }

    req.profile = user;
    next();
  });
};

exports.authMiddleWare = authMiddleWare;

var adminMiddleWare = function adminMiddleWare(req, res, next) {
  var adminUserId = req.user._id;

  _user["default"].findOne({
    _id: adminUserId
  }).exec(function (err, user) {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'Admin resource, Access denied'
      });
    }

    req.profile = user;
    next();
  });
};

exports.adminMiddleWare = adminMiddleWare;

var forgetPassword = function forgetPassword(req, res) {
  var email = req.body.email; // check fi user exists with that email

  _user["default"].findOne({
    email: email
  }).exec(function (err, user) {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist'
      });
    } // generate token and email to user


    var token = _jsonwebtoken["default"].sign({
      name: user.name
    }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: '10m'
    }); // send email


    var params = (0, _email.forgetPasswordEmailParams)(email, token); // populate the db > user > resetPasswordLink

    return user.updateOne({
      resetPasswordLink: token
    }, function (err, success) {
      if (err) {
        return res.status(400).json({
          error: 'Password reset failed. Try later.'
        });
      }

      var sendEmail = ses.sendEmail(params).promise();
      sendEmail.then(function (data) {
        console.log('ses reset password success', data);
        return res.json({
          message: "Email has been sent to ".concat(email, ". Click on the link to reset your password")
        });
      })["catch"](function (err) {
        console.log('ses reset password failed', err);
        return res.json({
          message: "We could not verify your email. Try later."
        });
      });
    });
  });
};

exports.forgetPassword = forgetPassword;

var resetPassword = function resetPassword(req, res) {
  var _req$body3 = req.body,
      resetPasswordLink = _req$body3.resetPasswordLink,
      newPassword = _req$body3.newPassword;

  if (resetPasswordLink) {
    // check for expiry
    _jsonwebtoken["default"].verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (err, success) {
      if (err) {
        return res.status(400).json({
          error: 'Expired Link. Try agian.'
        });
      }

      _user["default"].findOne({
        resetPasswordLink: resetPasswordLink
      }).exec(function (err, user) {
        if (err || !user) {
          return res.status(400).json({
            error: 'Invalid token, Try agian.'
          });
        }

        var updatedFields = {
          password: newPassword,
          resetPasswordLink: ''
        };
        user = _lodash["default"].extend(user, updatedFields);
        user.save(function (err, result) {
          if (err) {
            return res.status(400).json({
              error: 'Password reset failed. Try again'
            });
          }

          res.json({
            message: "Great! Now you can login with your new password"
          });
        });
      });
    });
  }
};

exports.resetPassword = resetPassword;

var canUpdateDeleteLink = function canUpdateDeleteLink(req, res, next) {
  var id = req.params.slug.id;

  _link["default"].find({
    _id: id
  }).exec(function (err, data) {
    if (err) {
      return res.status(400).json({
        error: 'Could not find link'
      });
    }

    var authorizedUser = data.pastedBy._id.toString() === req.profile._id;
  });
};

exports.canUpdateDeleteLink = canUpdateDeleteLink;