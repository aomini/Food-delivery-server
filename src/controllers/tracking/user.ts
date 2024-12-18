import { FastifyRequest } from "fastify";
import { Controller } from "../../types/Request.types.js";
import type {
  Customer as CustomerType,
  DeliveryPartner as DeliveryPartnerType,
} from "../../models/user.js";
import { Customer, DeliveryPartner } from "../../models/user.js";
import { User } from "../auth.js";

export const updateUser: Controller<
  FastifyRequest<{ Body: CustomerType | DeliveryPartnerType }>
> = async (req, res) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    const user: User | null =
      (await DeliveryPartner.findById(userId)) ||
      (await Customer.findById(userId));

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    let updatedUser: User | null;

    if (user.role === "customer") {
      updatedUser = await Customer.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else if (user.role === "delivery_partner") {
      updatedUser = await DeliveryPartner.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      return res.status(400).send({ message: "Invalid user role" });
    }
    return res.send({
      message: "User udpated successfully",
      user: updatedUser,
    });
  } catch (err: unknown) {
    return res.status(500).send({ message: "User not udpated", err });
  }
};
