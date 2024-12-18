import { FastifyInstance } from "fastify";
import {
  fetchUser,
  loginCustomer,
  loginDeliveryPartner,
  refreshToken,
} from "../controllers/auth.js";
import { checkAuth } from "../middleware/auth.js";
import { updateUser } from "../controllers/tracking/user.js";

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/customer/login", loginCustomer);
  fastify.post("/delivery-partner/login", loginDeliveryPartner);
  fastify.post("/refresh-token", refreshToken);
  fastify.get("/me", { preHandler: [checkAuth] }, fetchUser);
  // @ts-ignore
  fastify.patch("/me", { preHandler: [checkAuth] }, updateUser);
};
