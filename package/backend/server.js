const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (thay thế database cho demo)
let users = [];
let tokens = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-123';

// Routes

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'EXE Project Backend API đang chạy! 🚀' });
});

// Test route cho API
app.get('/api', (req, res) => {
  res.json({ message: 'API endpoint hoạt động! ✅' });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    console.log('📝 Register request received:', req.body);
    
    const { username, email, password, confirmpassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: 'Tất cả các trường đều bắt buộc'
      });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({
        error: 'Mật khẩu xác nhận không khớp'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => 
      user.email === email || user.username === username
    );

    if (existingUser) {
      return res.status(400).json({
        error: 'Người dùng với email hoặc username này đã tồn tại'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      _id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      role: 'user',
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store token
    tokens.push(token);

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    console.log('✅ User registered successfully:', userResponse.username);

    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      error: 'Lỗi server nội bộ'
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email và mật khẩu đều bắt buộc'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({
        error: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store token
    tokens.push(token);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    console.log('✅ User logged in successfully:', userResponse.username);

    res.json({
      message: 'Đăng nhập thành công!',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      error: 'Lỗi server nội bộ'
    });
  }
});

// Get current user endpoint
app.get('/api/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token không hợp lệ'
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = users.find(u => u._id === decoded.userId);

    if (!user) {
      return res.status(404).json({
        error: 'Người dùng không tồn tại'
      });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(401).json({
      error: 'Token không hợp lệ'
    });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token không hợp lệ'
      });
    }

    const token = authHeader.substring(7);

    // Remove token from storage
    const tokenIndex = tokens.indexOf(token);
    if (tokenIndex > -1) {
      tokens.splice(tokenIndex, 1);
    }

    res.json({
      message: 'Đăng xuất thành công!'
    });

  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      error: 'Lỗi server nội bộ'
    });
  }
});

// Get all users (for testing)
app.get('/api/users', (req, res) => {
  const usersWithoutPassword = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json({
    count: users.length,
    users: usersWithoutPassword
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🔐 Test endpoints:`);
  console.log(`   POST /api/register - Đăng ký`);
  console.log(`   POST /api/login - Đăng nhập`);
  console.log(`   GET  /api/me - Lấy thông tin user`);
  console.log(`   POST /api/logout - Đăng xuất`);
  console.log(`   GET  /api/users - Xem tất cả users (test)`);
});
