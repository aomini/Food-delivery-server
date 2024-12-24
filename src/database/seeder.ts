import "dotenv/config";
import { Types } from "mongoose";
import connectDB from "../config/database/connect.js";
import Category from "../models/category.js";
import { categories, products } from "./seedData.js";
import Product from "../models/product.js";

const main = async () => {
  if (process.env.MONGO_URI) {
    await connectDB(process.env.MONGO_URI);
    console.log("Database connected successfully");
    await Category.deleteMany({});
    await Product.deleteMany({});
    const insertedCategories = await Category.insertMany(categories);
    const categoryMap: Record<string, Types.ObjectId> =
      insertedCategories.reduce((acc, category) => {
        const { id, name } = category;
        acc = { ...acc, [name]: id };
        return acc;
      }, {});
    const productsWithCategories = products.map((product) => {
      const { category, ...restProductData } = product;
      return { ...restProductData, category: categoryMap[category] };
    });
    console.log(productsWithCategories.slice(1), categoryMap);
    await Product.insertMany(productsWithCategories);
    process.exit();
  } else {
    process.exit();
    throw Error("Database URI not available");
  }
};
main();
