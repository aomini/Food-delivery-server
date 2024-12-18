import { FastifyInstance } from "fastify";
import { checkAuth } from "../middleware/auth.js";
import {
  confirmOrder,
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../controllers/order/order.js";

export const orderRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", checkAuth);
  fastify.post("/orders", createOrder);
  fastify.get("/orders", getOrders);
  fastify.patch("/orders/:orderId/status", updateOrderStatus);
  fastify.post("/orders/:orderId/confirm", confirmOrder);
  fastify.get("/orders/:orderId", getOrderById);
};
