import Category from '../models/category';
import Link from '../models/link';
import slugify from 'slugify';
import formidable from 'formidable';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// s3
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const create = (req, res) => {
  const { name, image, content } = req.body;
  // image data
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );
  const type = image.split(';')[0].split('/')[1];

  const slug = slugify(name);
  let category = new Category({ name, content, slug });

  // upload image to s3
  const params = {
    Bucket: 'hackr-douglas',
    Key: `category/${uuidv4()}.${type}`,
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: `image/${type}`,
  };

  s3.upload(params, (err, data) => {
    if (err) res.status(400).json({ error: 'Upload to s3 failed' });
    console.log('aws upload res data', data);
    category.image.url = data.Location;
    category.image.key = data.Key;
    // posted by
    category.postedBy = req.user._id;

    // save to db
    category.save((err, success) => {
      if (err) {
        console.log('err', err);
        res.status(400).json({
          error: 'Error saving category to db',
        });
      }
      return res.json(success);
    });
  });
};

// export const create = (req, res) => {
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

export const list = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Categories could not load',
      });
    }
    res.json(data);
  });
};

export const read = (req, res) => {
  const { slug } = req.params;
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  Category.findOne({ slug })
    .populate('postedBy', '_id name username')
    .exec((err, category) => {
      if (err) {
        return res.status(400).json({
          error: 'Could not load category',
        });
      }
      // res.json({ category });
      Link.find({ categories: category })
        .populate('postedBy', '_id name username')
        .populate('categories', 'name')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec((err, links) => {
          if (err) {
            return res.status(400).json({
              error: 'Could not load links of a category',
            });
          }
          res.json({ category, links });
        });
    });
};

export const update = (req, res) => {
  const { slug } = req.params;
  const { name, image, content } = req.body;

  Category.findOneAndUpdate({ slug }, { name, content }, { new: true }).exec(
    (err, updated) => {
      if (err) {
        return res.status(400).json({
          error: 'Could not find category to update',
        });
      }
      console.log('Updated', updated);
      if (image) {
        // remove the existing image from s3 before uploading new/updated one
        const deleteParams = {
          Bucket: 'hackr-douglas',
          Key: `${updated.image.key}`,
        };
        s3.deleteObject(deleteParams, (err, data) => {
          if (err) console.log('S3 delete error during update', err);
          else console.log('s3 deleted during update', data);
        });

        // image data
        const base64Data = new Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ''),
          'base64'
        );
        const type = image.split(';')[0].split('/')[1];

        // handle upload image
        const params = {
          Bucket: 'hackr-douglas',
          Key: `category/${uuidv4()}.${type}`,
          Body: base64Data,
          ACL: 'public-read',
          ContentEncoding: 'base64',
          ContentType: `image/${type}`,
        };

        s3.upload(params, (err, data) => {
          if (err) res.status(400).json({ error: 'Upload to s3 failed' });
          console.log('aws upload res data', data);
          updated.image.url = data.Location;
          updated.image.key = data.Key;

          // save to db
          updated.save((err, success) => {
            if (err) {
              console.log('err', err);
              res.status(400).json({
                error: 'Error saving category to db',
              });
            }
            res.json(success);
          });
        });
      } else {
        res.json(updated);
      }
    }
  );
};

export const remove = (req, res) => {
  const { slug } = req.params;

  Category.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Could not delete category',
      });
    }

    // remove the existing image from s3 before uploading new/updated one
    const deleteParams = {
      Bucket: 'hackr-douglas',
      Key: `${data.image.key}`,
    };
    s3.deleteObject(deleteParams, (err, data) => {
      if (err) console.log('S3 delete error during', err);
      else console.log('s3 deleted during update', data);
    });

    res.json({
      message: 'Category deleted successfully',
    });
  });
};
