import { FastifyInstance } from "fastify";
import { fetchCategories } from "../controllers/product/category.js";
import { getProductsByCategoryId } from "../controllers/product/product.js";

export const productRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/products/categories", fetchCategories);
  fastify.get("/products/categories/:categoryId", getProductsByCategoryId);
};
