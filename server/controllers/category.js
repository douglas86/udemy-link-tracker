import Category from '../models/category';
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
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload',
            });
        }
        // console.table({ err, fields, files });
        const { name, content } = fields;
        const { image } = files;
        const slug = slugify(name);
        let category = new Category({ name, content });
        if (image.size > 2000000) {
            return res.status(400).json({
                error: 'Image should be less than 3mb',
            });
        }

        // upload image to s3
        const params = {
            Bucket: 'hackr-douglas',
            Key: `category/${uuidv4()}`,
            Body: fs.readFileSync(image.filepath),
            ACL: 'public-read',
            ContentType: 'image/jpg',
        };

        s3.upload(params, (err, data) => {
            if (err) res.status(400).json({ error: 'Upload to s3 failed' });
            console.log('aws upload res data', data);
            category.image.url = data.Location;
            category.image.key = data.Key;

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
    });
};

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
    //
};

export const read = (req, res) => {
    //
};

export const update = (req, res) => {
    //
};

export const remove = (req, res) => {
    //
};
