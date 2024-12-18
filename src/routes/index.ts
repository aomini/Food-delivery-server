import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth-routes.js";
import { productRoutes } from "./product-routes.js";
import { orderRoutes } from "./order-routes.js";

const prefix = "/api";
export const registerRoutes = async (fastify: FastifyInstance) => {
  fastify.register(authRoutes, { prefix });
  fastify.register(productRoutes, { prefix });
  fastify.register(orderRoutes, { prefix });
};
