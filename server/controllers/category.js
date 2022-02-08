import Category from '../models/category';
import slugify from 'slugify';

export const create = (req, res) => {
    const { name, content } = req.body;
    const slug = slugify(name);
    const image = {
        url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
        key: '123',
    };

    const category = new Category({ name, slug, image });
    category.postedBy = req.user._id;
    category.save((error, data) => {
        if (error) {
            console.log('category create error', err);
            return res.status(400).json({
                error: 'Category create failed',
            });
        }
        res.json(data);
    });
};

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
