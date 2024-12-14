import mongoose from "mongoose";

// Base User Schema
const userSchema = new mongoose.Schema({
  name: { type: String },
  role: {
    type: String,
    enum: ["customer", "admin", "delivery_partner"],
    required: true,
  },
  isActive: { type: Boolean, default: false },
});

/** Customer Schema */
const customerSchema = new mongoose.Schema({
  ...userSchema.obj,
  phone: { type: Number, required: true, unique: true },
  role: { type: String, enum: ["customer"], default: "Customer" },
  liveLocation: {
    lat: Number,
    lng: Number,
  },
  address: String,
});

/** Delivery Partner Schema */
const deliveryPartnerSchema = new mongoose.Schema({
  ...userSchema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  role: {
    type: String,
    enum: ["delivery_partner"],
    default: "delivery_partner",
  },
  liveLocation: {
    lat: Number,
    lng: Number,
  },
  address: String,
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
  },
});
/** Admin Schema */
const adminSchema = new mongoose.Schema({
  ...userSchema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
  },
});

export const Customer = mongoose.model("Customer", customerSchema);
export const DeliveryPartner = mongoose.model(
  "Delivery_Partner",
  deliveryPartnerSchema
);
export const Admin = mongoose.model("Admin", adminSchema);
