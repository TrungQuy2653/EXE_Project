import express from "express";
import { connectionDB } from "./src/config/db.js";
import dotenv from "dotenv";
import authRouter from './src/routers/auth.js';
import productRouter from './src/routers/product.js';
import businessRouter from './src/routers/business.js';
import cors from 'cors';

dotenv.config();
const app = express();

// CORS middleware để cho phép frontend gọi API
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Thêm middleware để parse JSON body
app.use(express.json());

//connectdb
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/exe_project';
console.log("DB_URI thực tế:", DB_URI);
console.log("Bắt đầu kết nối MongoDB...");
connectionDB(DB_URI).catch(err => {
  console.error("Lỗi kết nối MongoDB:", err);
  console.log("Tiếp tục chạy server mà không cần database...");
});
console.log("Đã gọi hàm connectionDB");

//router
app.use("/api", authRouter);
app.use("/api/products", productRouter);
app.use("/api/business", businessRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/signup, /api/signin, /api/logout',
      products: '/api/products',
      business: '/api/business'
    }
  });
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log(`✅ Server đang chạy tại port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 API health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 Frontend URL: http://localhost:3000`);
  console.log('🚀 ========================================');
});
