import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJsMongoose from "@adminjs/mongoose";
import { Admin, Customer, DeliveryPartner } from "../models/user.js";
import { Branch } from "../models/branch.js";
import { FastifyInstance } from "fastify";
import { authenticate, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";
import Category from "../models/category.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import Counter from "../models/counter.js";

AdminJS.registerAdapter(AdminJsMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Customer,
      options: {
        listProperties: ["phone", "role", "isActive"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: DeliveryPartner,
      options: {
        listProperties: ["email", "role", "isActive"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Admin,
      options: {
        listProperties: ["email", "role", "isActive"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Branch,
    },
    {
      resource: Product,
    },
    {
      resource: Category,
    },
    {
      resource: Counter,
    },
    {
      resource: Order,
    },
  ],
  branding: {
    companyName: "Rks",
    withMadeWithLove: false,
    favicon:
      "https://res.cloudinary.com/dvwdfu0ai/image/upload/v1734352524/samples/cloudinary-icon.png",
    logo: "https://res.cloudinary.com/dvwdfu0ai/image/upload/v1734352524/samples/cloudinary-logo-vector.png",
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  rootPath: "/admin",
});
export const buildAdminRouter = async (app: FastifyInstance) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate: authenticate,
      cookiePassword: process.env.COOKIE_PASSWORD || "",
      cookieName: "adminjs",
    },
    app as any,
    {
      store: sessionStore,
      saveUninitialized: true,
      secret: process.env.COOKIE_PASSWORD || "",
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
};
