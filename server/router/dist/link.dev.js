"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _link = require("../validators/link");

var _validators = require("../validators");

var _auth = require("../controllers/auth");

var _link2 = require("../controllers/link");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // validators


// routes
router.post('/link', _link.linkCreateValidator, _validators.runValidation, _auth.requireSignIn, _auth.authMiddleWare, _link2.create);
router.post('/links', _auth.requireSignIn, _auth.adminMiddleWare, _link2.list);
router.put('/click-count', _link2.clickCount);
router.get('/link/:id', _link2.read);
router.put('/link/:id', _link.linkUpdateValidator, _validators.runValidation, _auth.requireSignIn, _auth.authMiddleWare, _link2.update);
router["delete"]('/link/:id', _auth.requireSignIn, _auth.authMiddleWare, _link2.remove);
var _default = router;
exports["default"] = _default;