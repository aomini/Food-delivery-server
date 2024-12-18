import { Document } from "mongoose";
import { Admin, Customer, DeliveryPartner } from "../models/user.js";
import jwt from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";
import { Auth } from "../middleware/auth.js";

export type User = Customer | DeliveryPartner;
export type Token = {
  userId: string;
  role: "delivery_partner" | "customer";
};

const generateAuthToken = (user: Document<any, any, User> & User) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET || "",
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET || "",
    { expiresIn: "1d" }
  );
  return { accessToken, refreshToken };
};

export const loginCustomer = async (
  req: FastifyRequest<{ Body: { phone: string } }>,
  res: FastifyReply
) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({
        phone,
        role: "customer",
        isActive: true,
      });
      await customer.save();
    }
    const { accessToken, refreshToken } = generateAuthToken(customer);
    return res.send({
      message: customer ? "Login successful" : "Customer created and logged in",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).send({ message: "An error occured" });
  }
};

export const loginDeliveryPartner = async (
  req: FastifyRequest<{ Body: { email: string; password: string } }>,
  res: FastifyReply
) => {
  try {
    const { email, password } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return res.status(404).send({ message: "Delivery Partner not found" });
    }
    const isMatch = password === deliveryPartner.password;
    if (!isMatch) {
      return res.status(400).send({ message: "Credentials donot match" });
    }
    const { accessToken, refreshToken } = generateAuthToken(deliveryPartner);
    return res.send({
      message: "Login successfully",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).send({ message: "An error occured" });
  }
};

export const refreshToken = async (
  req: FastifyRequest<{ Body: { refreshToken: string } }>,
  res: FastifyReply
) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || ""
    ) as Token;
    let user: (Document<unknown, {}, User> & User) | null;
    if (typeof decoded !== "object") {
      return res.status(400).send({ message: "Invalid token" });
    }
    if ("role" in decoded && decoded.role === "customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "delivery_partner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return res.status(403).send({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const { accessToken, refreshToken: newRefreshToken } =
      generateAuthToken(user);
    return res.send({
      message: "Token refreshed",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err: unknown) {
    console.log(err);
    return res.status(403).send({ message: "Invalid refresh token" });
  }
};

export const fetchUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { userId, role } = req.user;

    let user: (Document<unknown, {}, User> & User) | null;
    if (role === "customer") {
      user = await Customer.findById(userId);
    } else if (role === "delivery_partner") {
      user = await DeliveryPartner.findById(userId);
    } else {
      return res.status(403).send({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.send({
      message: "User fetched successful",
      user,
    });
  } catch (err: unknown) {
    return res.status(500).send({ message: "An error occured" });
  }
};
