import "dotenv/config";

import Fastify from "fastify";
import { MongoClient } from "mongodb";
import connectDB from "./config/database/connect.js";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    if (process.env.MONGO_URI) {
      await connectDB(process.env.MONGO_URI);
    } else {
      throw Error("Database URI not available");
    }
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log("Blinkit started on https://localhost:", port);
  } catch (err: unknown) {
    fastify.log.error(err);
    process.exit();
  }
};
start();
