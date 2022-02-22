import Link from "../models/link";
import slugify from "slugify";

// create, list, read, update, remove
export const create = (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  console.table({ title, url, categories, type, medium });
};

export const list = (req, res) => {};

export const read = (req, res) => {};

export const update = (req, res) => {};

export const remove = (req, res) => {};
