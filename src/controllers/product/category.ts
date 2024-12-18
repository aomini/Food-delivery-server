import Category from "../../models/category.js";
import { Controller } from "../../types/Request.types.js";

export const fetchCategories: Controller = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.send(categories);
  } catch (err: unknown) {
    return res.send(500).send({ message: "An error occured", err });
  }
};
