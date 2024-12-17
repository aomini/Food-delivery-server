import fastify from "fastify";
import { Token } from "./src/controllers/auth.ts";

declare module "fastify" {
  interface FastifyRequest {
    user: Token;
  }
}
