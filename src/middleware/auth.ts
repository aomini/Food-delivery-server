import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { Token } from "../controllers/auth.js";

export type Auth = { user: Token };

export const checkAuth = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Access token required" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || ""
    ) as Token;
    req.user = decoded;
    return true;
  } catch (err) {
    return res.status(403).send({ message: "Invalid or expired token" });
  }
};
