import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";

const MongoDBStore = ConnectMongoDBSession(fastifySession as any);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI || "",
  collection: "session",
});

sessionStore.on("error", (error) => {
  console.log("Session Store error", error);
});

export const authenticate = async (email: string, password: string) => {
  if (email === "rakesh@gmail.com") {
    return Promise.resolve({ email });
  }
  return null;
};
