import { FastifyRequest } from "fastify";
import Product from "../../models/product.js";
import { Controller } from "../../types/Request.types.js";
import { Types } from "mongoose";

export const getProductsByCategoryId: Controller<
  FastifyRequest<{
    Params: {
      categoryId: Types.ObjectId;
    };
  }>
> = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({
      category: categoryId,
    })
      .select("-category")
      .exec();
    return res.status(200).send(products);
  } catch (err: unknown) {
    return res.status(500).send({ message: "Something went wrong", err });
  }
};
