import AdminJS from "adminjs";
import * as AdminJsMongoose from "@adminjs/mongoose";
import { Customer } from "../models/user.js";

AdminJS.registerAdapter(AdminJsMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Customer,
      options: {
        listProperties: ["phone", "role", "isActivate"],
      },
    },
  ],
});
