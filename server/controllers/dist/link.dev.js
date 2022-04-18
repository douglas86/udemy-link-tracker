"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clickCount = exports.remove = exports.update = exports.read = exports.list = exports.create = void 0;

var _link = _interopRequireDefault(require("../models/link"));

var _slugify = _interopRequireDefault(require("slugify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// create, list, read, update, remove
var create = function create(req, res) {
  var _req$body = req.body,
      title = _req$body.title,
      url = _req$body.url,
      categories = _req$body.categories,
      type = _req$body.type,
      medium = _req$body.medium; // console.table({ title, url, categories, type, medium });

  var slug = url;
  var link = new _link["default"]({
    title: title,
    url: url,
    categories: categories,
    type: type,
    medium: medium,
    slug: slug
  }); // posted by user

  link.postedBy = req.user._id;
  link.save(function (err, data) {
    if (err) {
      return res.status(400).json({
        error: 'Link already exist'
      });
    }

    res.json(data);
  });
};

exports.create = create;

var list = function list(req, res) {
  var limit = req.body.limit ? parseInt(req.body.limit) : 10;
  var skip = req.body.skip ? parseInt(req.body.skip) : 0;

  _link["default"].find({}).populate('postedBy', 'name').populate('categories', 'name, slug').sort({
    createdAt: -1
  }).skip(skip).limit(limit).exec(function (err, data) {
    if (err) {
      return res.status(400).json({
        error: 'Could not list links'
      });
    }

    res.json(data);
  });
};

exports.list = list;

var read = function read(req, res) {
  var id = req.params.id;

  _link["default"].findOne({
    _id: id
  }).exec(function (err, data) {
    if (err) {
      return res.status(400).json({
        error: 'Error finding link'
      });
    }

    res.json(data);
  });
};

exports.read = read;

var update = function update(req, res) {
  var id = req.params.id;
  var _req$body2 = req.body,
      title = _req$body2.title,
      url = _req$body2.url,
      category = _req$body2.category,
      type = _req$body2.type,
      medium = _req$body2.medium;
  var updatedLink = {
    title: title,
    url: url,
    category: category,
    type: type,
    medium: medium
  };

  _link["default"].findOneAndUpdate({
    _id: id
  }, updatedLink, {
    "new": true
  }).exec(function (err, updated) {
    if (err) {
      return res.status(400).json({
        error: 'Error updating the link'
      });
    }

    res.json(updated);
  });
};

exports.update = update;

var remove = function remove(req, res) {
  var id = req.params.id;

  _link["default"].findOneAndRemove({
    _id: id
  }).exec(function (err, data) {
    if (err) {
      return res.status(400).json({
        error: 'Error removing the link'
      });
    }

    res.json({
      message: 'Link removed successfully'
    });
  });
};

exports.remove = remove;

var clickCount = function clickCount(req, res) {
  var linkId = req.body.linkId;

  _link["default"].findByIdAndUpdate(linkId, {
    $inc: {
      clicks: 1
    }
  }, {
    upsert: true,
    "new": true
  }).exec(function (err, result) {
    if (err) {
      return res.status(400).json({
        error: 'Could not update view count'
      });
    }

    res.json(result);
  });
};

exports.clickCount = clickCount;