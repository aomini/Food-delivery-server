import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth-routes.js";

const prefix = "/api";
export const registerRoutes = async (fastify: FastifyInstance) => {
  fastify.register(authRoutes, { prefix });
};
