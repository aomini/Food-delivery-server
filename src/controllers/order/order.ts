import { FastifyRequest } from "fastify";
import { Controller } from "../../types/Request.types.js";
import { Branch } from "../../models/branch.js";
import { Customer, DeliveryPartner } from "../../models/user.js";
import { Types } from "mongoose";
import Order from "../../models/order.js";

export const createOrder: Controller<
  FastifyRequest<{
    Body: {
      items: {
        id: Types.ObjectId;
        item: Types.ObjectId;
        count: number;
      }[];
      branch: Types.ObjectId;
      totalPrice: number;
    };
  }>
> = async (req, res) => {
  try {
    const { userId } = req.user;
    const { items, branch, totalPrice } = req.body;
    const customer = await Customer.findById(userId);
    const branchData = await Branch.findById(branch);
    if (!customer) {
      return res.status(404).send({ message: "Customer not found" });
    }

    const newOrder = new Order({
      customer,
      items: items.map((item) => ({
        id: item.id,
        item: item.item,
        count: item.count,
      })),
      branch: branchData,
      totalPrice,
      deliveryLocation: {
        lat: customer.liveLocation?.lat,
        lng: customer.liveLocation?.lng,
        address: customer.address,
      },
      pickupLocation: {
        lat: branchData?.location?.lat,
        lng: branchData?.location?.lng,
        address: branchData?.Address,
      },
    });
    const savedOrder = await newOrder.save();
    return res.status(201).send(savedOrder);
  } catch (err: unknown) {
    return res.status(500).send({ message: "Failed to create order", err });
  }
};

export const confirmOrder: Controller<
  FastifyRequest<{
    Params: { orderId: Types.ObjectId };
    Body: {
      deliveryPersonLocation: {
        lat: number;
        lng: number;
        address: string;
      };
    };
  }>
> = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { deliveryPersonLocation } = req.body;
    const deliveryPerson = await DeliveryPartner.findById(userId);
    if (!deliveryPerson) {
      return res.status(404).send({ message: "Delivery Person not found" });
    }
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send({ message: "Order not found" });
    if (order.status !== "available") {
      return res.status(400).send({ message: "Order is not available" });
    }
    order.status = "confirmed";
    order.deliveryPartner = userId;
    order.deliveryPersonLocation = {
      lat: deliveryPersonLocation.lat,
      lng: deliveryPersonLocation.lng,
      address: deliveryPersonLocation.address,
    };
    await order.save();
    req.server.io
      .to(orderId as unknown as string)
      .emit("orderConfirmed", order);
    return res.send(order);
  } catch (err: unknown) {
    return res.status(500).send({ message: "Failed to confirm order", err });
  }
};

export const updateOrderStatus: Controller<
  FastifyRequest<{
    Params: { orderId: Types.ObjectId };
    Body: {
      status: "confirmed" | "arriving" | "delivered" | "cancelled";
      deliveryPersonLocation: {
        lat: number;
        lng: number;
        address: string;
      };
    };
  }>
> = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { status, deliveryPersonLocation } = req.body;
    const deliveryPerson = await DeliveryPartner.findById(userId);
    if (!deliveryPerson) {
      return res.status(404).send({ message: "Delivery Person not found" });
    }
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send({ message: "Order not found" });
    if (
      (order.deliveryPartner?.toString() as unknown as Types.ObjectId) !==
      userId
    ) {
      return res
        .status(403)
        .send({ message: "Order cannot be updated by the user" });
    }
    if (["cancelled", "delivered"].includes(order.status)) {
      return res.status(400).send({ message: "Order cannot be updated" });
    }

    order.status = status;
    order.deliveryPartner = userId;
    order.deliveryPersonLocation = {
      lat: deliveryPersonLocation.lat,
      lng: deliveryPersonLocation.lng,
      address: deliveryPersonLocation.address,
    };
    await order.save();
    req.server.io
      .to(orderId as unknown as string)
      .emit("liveTrackingUpdates", order);
    return res.send(order);
  } catch (err: unknown) {
    return res.status(500).send({ message: "Failed to update order", err });
  }
};

export const getOrders: Controller<
  FastifyRequest<{
    Querystring: {
      status: string;
      customerId: Types.ObjectId;
      deliveryParnerId: Types.ObjectId;
      branchId: Types.ObjectId;
    };
  }>
> = async (req, res) => {
  try {
    const { status, customerId, deliveryParnerId, branchId } = req.query;
    let query: Partial<{
      status: string;
      customer: Types.ObjectId;
      deliveryPartner: Types.ObjectId;
      branch: Types.ObjectId;
    }> = {};

    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customer = customerId;
    }
    if (deliveryParnerId) {
      query.deliveryPartner = customerId;
      query.branch = branchId;
    }
    const orders = await Order.find(query).populate(
      "customer branch items.item deliveryPartner"
    );
    return res.send(orders);
  } catch (err: unknown) {
    console.log(err);
    return res.status(500).send({ message: "Failed to retrieve orders", err });
  }
};

export const getOrderById: Controller<
  FastifyRequest<{
    Params: {
      orderId: Types.ObjectId;
    };
  }>
> = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner"
    );
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    return res.send(order);
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).send({ message: "Failed to retrieve order", err });
  }
};
