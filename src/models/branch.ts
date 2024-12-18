import mongoose, { InferSchemaType } from "mongoose";
import { DeliveryPartner } from "./user.js";

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: String,
    lng: String,
  },
  Address: { type: String },
  DeliveryPartner: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Delivery_Partner",
    },
  ],
});
export const Branch = mongoose.model("Branch", branchSchema);
export type Branch = InferSchemaType<typeof branchSchema>;
