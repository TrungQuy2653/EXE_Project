import express from "express";
import { connectionDB } from "./config/db.js";
import dotenv from "dotenv";
import authRouter from './routers/auth.js';
import productRouter from './routers/product.js';
import businessRouter from './routers/business.js';
import cors from 'cors';

dotenv.config();
const app = express();

// CORS middleware để cho phép frontend gọi API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Thêm middleware để parse JSON body
app.use(express.json());

//connectdb
console.log("DB_URI thực tế:", process.env.DB_URI);
console.log("Bắt đầu kết nối MongoDB...");
connectionDB(process.env.DB_URI);
console.log("Đã gọi hàm connectionDB");

//router
app.use("/api", authRouter);
app.use("/api/products", productRouter);
app.use("/api/business", businessRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Chạy server nếu file được execute trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

// Export cho Vite
export const viteNodeApp = app; 