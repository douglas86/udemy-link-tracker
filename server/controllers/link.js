import Link from '../models/link';
import slugify from 'slugify';

// create, list, read, update, remove
export const create = (req, res) => {
    const { title, url, categories, type, medium } = req.body;
    // console.table({ title, url, categories, type, medium });
    const slug = url;
    let link = new Link({ title, url, categories, type, medium, slug });
    // posted by user
    link.postedBy = req.user._id;
    link.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Link already exist',
            });
        }
        res.json(data);
    });
};

export const list = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    Link.find({})
        .populate('postedBy', 'name')
        .populate('categories', 'name, slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Could not list links',
                });
            }
            res.json(data);
        });
};

export const read = (req, res) => {
    const { id } = req.params;
    Link.findOne({ _id: id }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Error finding link',
            });
        }
        res.json(data);
    });
};

export const update = (req, res) => {
    const { id } = req.params;
    const { title, url, category, type, medium } = req.body;
    const updatedLink = { title, url, category, type, medium };

    Link.findOneAndUpdate({ _id: id }, updatedLink, { new: true }).exec(
        (err, updated) => {
            if (err) {
                return res.status(400).json({
                    error: 'Error updating the link',
                });
            }
            res.json(updated);
        }
    );
};

export const remove = (req, res) => {
    const { id } = req.params;
    Link.findOneAndRemove({ _id: id }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Error removing the link',
            });
        }
        res.json({
            message: 'Link removed successfully',
        });
    });
};

export const clickCount = (req, res) => {
    const { linkId } = req.body;
    Link.findByIdAndUpdate(
        linkId,
        { $inc: { clicks: 1 } },
        { upsert: true, new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not update view count',
            });
        }
        res.json(result);
    });
};
