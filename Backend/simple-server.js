import express from "express";
import cors from 'cors';

const app = express();

// CORS middleware để cho phép frontend gọi API
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Thêm middleware để parse JSON body
app.use(express.json());

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
      verify: '/api/verify-token'
    }
  });
});

// Simple auth endpoints for testing
app.post('/api/signin', (req, res) => {
  console.log('🔐 Signin request:', req.body);
  
  const { email, password } = req.body;
  
  // Simple test credentials
  if (email === 'admin@exe.com' && password === 'admin123') {
    const token = 'test-token-' + Date.now();
    res.json({
      message: "Đăng nhập thành công!",
      token,
      data: { 
        id: 'admin-id', 
        username: 'admin', 
        email: 'admin@exe.com', 
        role: 'admin' 
      }
    });
  } else {
    res.status(400).json({ errors: ["Sai email hoặc mật khẩu!"] });
  }
});

app.post('/api/signup', (req, res) => {
  console.log('📝 Signup request:', req.body);
  
  const { username, email, password, confirmpassword } = req.body;
  
  if (password !== confirmpassword) {
    return res.status(400).json({ errors: ["Mật khẩu xác nhận không khớp!"] });
  }
  
  const token = 'test-token-' + Date.now();
  res.status(201).json({
    message: "Đăng ký thành công!",
    token,
    data: { 
      id: 'user-id-' + Date.now(), 
      username, 
      email, 
      role: 'user' 
    }
  });
});

app.post('/api/logout', (req, res) => {
  res.json({ message: "Đăng xuất thành công!" });
});

app.get('/api/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ errors: ["Token không hợp lệ!"] });
  }
  
  const token = authHeader.split(' ')[1];
  if (token.startsWith('test-token-')) {
    res.json({
      id: 'admin-id',
      username: 'admin',
      email: 'admin@exe.com',
      role: 'admin'
    });
  } else {
    res.status(401).json({ errors: ["Token không hợp lệ!"] });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Lỗi server nội bộ',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Đã xảy ra lỗi'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại',
    path: req.originalUrl,
    method: req.method
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
  console.log('🔐 Test credentials:');
  console.log('   Email: admin@exe.com');
  console.log('   Password: admin123');
  console.log('🚀 ========================================');
});
