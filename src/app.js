import express from "express";
import { connectionDB } from "./config/db";
import dotenv from "dotenv";
import authRouter from './routers/auth';
import productRouter from './routers/product.js';
dotenv.config();
const app = express();
// Thêm middleware để parse JSON body
app.use(express.json());
//midleware

//connectdb
console.log("DB_URI thực tế:", process.env.DB_URI);
console.log("Bắt đầu kết nối MongoDB...");
connectionDB(process.env.DB_URI);
console.log("Đã gọi hàm connectionDB");

//router
app.use("/api", authRouter);
app.use("/api/products", productRouter);
export const viteNodeApp = app;