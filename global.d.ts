import fastify from "fastify";
import { Token } from "./src/controllers/auth.ts";
import { Server } from "socket.io";
import { Order } from "./src/models/order.ts";
import { Document } from "mongoose";

declare module "fastify" {
  interface FastifyRequest {
    user: Token;
  }

  interface FastifyInstance {
    io: Server<{ orderConfirmed: any; liveTrackingUpdates: any }>;
  }
}
