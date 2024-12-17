import "dotenv/config";

import Fastify from "fastify";
import connectDB from "./config/database/connect.js";
import { admin, buildAdminRouter } from "./config/setup.js";
import { registerRoutes } from "./routes/index.js";

const fastify = Fastify({
  logger: true,
});

registerRoutes(fastify);

const start = async () => {
  try {
    await buildAdminRouter(fastify);
    if (process.env.MONGO_URI) {
      await connectDB(process.env.MONGO_URI);
    } else {
      throw Error("Database URI not available");
    }
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(
      `Server started on https://localhost:${port}/${admin.options.rootPath}`
    );
  } catch (err: unknown) {
    console.log(err);
    fastify.log.error(err);
    process.exit();
  }
};
start();
