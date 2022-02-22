import Link from "../models/link";
import slugify from "slugify";

// create, list, read, update, remove
export const create = (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  // console.table({ title, url, categories, type, medium });
  const slug = url;
  let link = new Link({ title, url, categories, type, medium, slug });
  // posted by user
  link.postedBy = req.user._id;
  // categories
  let arrayOfCategories = categories && categories.split(",");
  link.categories = arrayOfCategories;
  link.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Link already exist",
      });
    }
    res.json(data);
  });
};

export const list = (req, res) => {
  Link.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Could not list links",
      });
    }
    res.json(data);
  });
};

export const read = (req, res) => {};

export const update = (req, res) => {};

export const remove = (req, res) => {};