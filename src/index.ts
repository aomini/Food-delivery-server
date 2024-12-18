import "dotenv/config";

import Fastify from "fastify";
import connectDB from "./config/database/connect.js";
import { admin, buildAdminRouter } from "./config/setup.js";
import { registerRoutes } from "./routes/index.js";
import fastifySocketIO from "fastify-socket.io";

const fastify = Fastify({
  logger: true,
});

// @ts-ignore
fastify.register(fastifySocketIO, {
  cors: {
    origin: "*",
  },
  pingInterval: 1000,
  pingTimeout: 5000,
  transports: ["websocket"],
});

registerRoutes(fastify);

const start = async () => {
  try {
    await buildAdminRouter(fastify);
    fastify.ready((err) => {
      if (err) throw err;
      fastify.io.on("connection", (socket: any) => {
        console.log("A user connected!", socket.id);

        // @ts-ignore
        socket.on("joinRoom", (orderId: string) => {
          socket.join(orderId);
          console.log("User joined room", orderId);
        });

        socket.on("disconnect", () => {
          console.log("User disconnected");
        });
      });
    });
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
