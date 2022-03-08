"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remove = exports.update = exports.read = exports.list = exports.create = void 0;

var _category = _interopRequireDefault(require("../models/category"));

var _link = _interopRequireDefault(require("../models/link"));

var _slugify = _interopRequireDefault(require("slugify"));

var _formidable = _interopRequireDefault(require("formidable"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _uuid = require("uuid");

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// s3
var s3 = new _awsSdk["default"].S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

var create = function create(req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      image = _req$body.image,
      content = _req$body.content; // image data

  var base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  var type = image.split(';')[0].split('/')[1];
  var slug = (0, _slugify["default"])(name);
  var category = new _category["default"]({
    name: name,
    content: content,
    slug: slug
  }); // upload image to s3

  var params = {
    Bucket: 'hackr-douglas',
    Key: "category/".concat((0, _uuid.v4)(), ".").concat(type),
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: "image/".concat(type)
  };
  s3.upload(params, function (err, data) {
    if (err) res.status(400).json({
      error: 'Upload to s3 failed'
    });
    console.log('aws upload res data', data);
    category.image.url = data.Location;
    category.image.key = data.Key; // posted by

    category.postedBy = req.user._id; // save to db

    category.save(function (err, success) {
      if (err) {
        console.log('err', err);
        res.status(400).json({
          error: 'Error saving category to db'
        });
      }

      return res.json(success);
    });
  });
}; // export const create = (req, res) => {
//     let form = new formidable.IncomingForm();
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'Image could not upload',
//             });
//         }
//         // console.table({ err, fields, files });
//         const { name, content } = fields;
//         const { image } = files;
//         const slug = slugify(name);
//         let category = new Category({ name, content });
//         if (image.size > 2000000) {
//             return res.status(400).json({
//                 error: 'Image should be less than 3mb',
//             });
//         }
//
//         // upload image to s3
//         const params = {
//             Bucket: 'hackr-douglas',
//             Key: `category/${uuidv4()}`,
//             Body: fs.readFileSync(image.filepath),
//             ACL: 'public-read',
//             ContentType: 'image/jpg',
//         };
//
//         s3.upload(params, (err, data) => {
//             if (err) res.status(400).json({ error: 'Upload to s3 failed' });
//             console.log('aws upload res data', data);
//             category.image.url = data.Location;
//             category.image.key = data.Key;
//
//             // save to db
//             category.save((err, success) => {
//                 if (err) {
//                     console.log('err', err);
//                     res.status(400).json({
//                         error: 'Error saving category to db',
//                     });
//                 }
//                 return res.json(success);
//             });
//         });
//     });
// };
// export const create = (req, res) => {
//     const { name, content } = req.body;
//     const slug = slugify(name);
//     const image = {
//         url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
//         key: '123',
//     };
//     const category = new Category({ name, slug, image });
//     category.postedBy = req.user._id;
//     category.save((error, data) => {
//         if (error) {
//             console.log('category create error', err);
//             return res.status(400).json({
//                 error: 'Category create failed',
//             });
//         }
//         res.json(data);
//     });
// };


exports.create = create;

var list = function list(req, res) {
  _category["default"].find({}).exec(function (err, data) {
    if (err) {
      return res.status(400).json({
        error: 'Categories could not load'
      });
    }

    res.json(data);
  });
};

exports.list = list;

var read = function read(req, res) {
  var slug = req.params.slug;
  var limit = req.body.limit ? parseInt(req.body.limit) : 10;
  var skip = req.body.skip ? parseInt(req.body.skip) : 0;

  _category["default"].findOne({
    slug: slug
  }).populate('postedBy', '_id name username').exec(function (err, category) {
    if (err) {
      return res.status(400).json({
        error: 'Could not load category'
      });
    } // res.json({ category });


    _link["default"].find({
      categories: category
    }).populate('postedBy', '_id name username').populate('categories', 'name').sort({
      createdAt: -1
    }).limit(limit).skip(skip).exec(function (err, links) {
      if (err) {
        return res.status(400).json({
          error: 'Could not load links of a category'
        });
      }

      res.json({
        category: category,
        links: links
      });
    });
  });
};

exports.read = read;

var update = function update(req, res) {
  var slug = req.params.slug;
  var _req$body2 = req.body,
      name = _req$body2.name,
      image = _req$body2.image,
      content = _req$body2.content;

  _category["default"].findOneAndUpdate({
    slug: slug
  }, {
    name: name,
    content: content
  }, {
    "new": true
  }).exec(function (err, updated) {
    if (err) {
      return res.status(400).json({
        error: 'Could not find category to update'
      });
    }

    console.log('Updated', updated);

    if (image) {
      // remove the existing image from s3 before uploading new/updated one
      var deleteParams = {
        Bucket: 'hackr-douglas',
        Key: "category/".concat(updated.image.key)
      };
      s3.deleteObject(deleteParams, function (err, data) {
        if (err) console.log('S3 delete error during update', err);else console.log('s3 deleted during update', data);
      }); // handle upload image

      var params = {
        Bucket: 'hackr-douglas',
        Key: "category/".concat((0, _uuid.v4)(), ".").concat(type),
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: "image/".concat(type)
      };
      s3.upload(params, function (err, data) {
        if (err) res.status(400).json({
          error: 'Upload to s3 failed'
        });
        console.log('aws upload res data', data);
        updated.image.url = data.Location;
        updated.image.key = data.Key; // save to db

        updated.save(function (err, success) {
          if (err) {
            console.log('err', err);
            res.status(400).json({
              error: 'Error saving category to db'
            });
          }

          res.json(success);
        });
      });
    } else {
      res.json(updated);
    }
  });
};

exports.update = update;

var remove = function remove(req, res) {//
};

exports.remove = remove;