import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: String,
    lng: String,
  },
  Address: { type: String },
  deliveryPartners: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Delivery_Partner",
    },
  ],
});

export const Branch = mongoose.model("Branch", branchSchema);
