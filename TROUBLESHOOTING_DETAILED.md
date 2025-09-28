# 🔧 Troubleshooting Guide - EXE Project

## 🚨 Lỗi thường gặp và cách khắc phục

### 1. Lỗi "fail to fetch" hoặc "Network Error"

#### Triệu chứng:
- Frontend không thể kết nối với Backend
- Console hiển thị: `Failed to fetch` hoặc `Network Error`
- API calls trả về lỗi

#### Nguyên nhân:
1. Backend chưa chạy
2. CORS chưa được cấu hình
3. Port bị chặn bởi firewall
4. URL API không đúng

#### Cách khắc phục:

**Bước 1: Kiểm tra Backend**
```bash
# Kiểm tra Backend có chạy không
curl http://localhost:5000/api/health

# Nếu không có response, khởi động Backend
cd BE/Backend
npm start
```

**Bước 2: Kiểm tra CORS**
```javascript
// Trong server.js, đảm bảo có CORS config
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Bước 3: Kiểm tra Environment Variables**
```bash
# Kiểm tra file .env.local trong Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Kiểm tra file .env trong Backend
FRONTEND_URL=http://localhost:3000
```

**Bước 4: Kiểm tra Firewall**
```bash
# Windows - Kiểm tra port có bị chặn không
netstat -an | findstr :5000
netstat -an | findstr :3000

# Tạm thời tắt Windows Firewall để test
# Control Panel > System and Security > Windows Defender Firewall
```

### 2. Lỗi "Cannot find module"

#### Triệu chứng:
- `Error: Cannot find module 'express'`
- `Module not found: Can't resolve 'react'`
- Dependencies không được tìm thấy

#### Cách khắc phục:

**Bước 1: Clear cache và cài lại**
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Cài lại dependencies
npm install
```

**Bước 2: Kiểm tra Node.js version**
```bash
# Kiểm tra version
node --version
npm --version

# Nếu version quá cũ, cập nhật Node.js
# Tải từ: https://nodejs.org/
```

**Bước 3: Sử dụng yarn thay vì npm**
```bash
# Cài yarn
npm install -g yarn

# Cài dependencies với yarn
yarn install
```

### 3. Lỗi MongoDB Connection

#### Triệu chứng:
- `MongoServerError: connect ECONNREFUSED`
- `MongooseError: Operation `users.findOne()` buffering timed out`
- Database connection failed

#### Cách khắc phục:

**Bước 1: Kiểm tra MongoDB có chạy không**
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod

# Kiểm tra status
mongosh --eval "db.adminCommand('ping')"
```

**Bước 2: Kiểm tra connection string**
```env
# Local MongoDB
DB_URI=mongodb://localhost:27017/exe_project

# MongoDB Atlas
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/exe_project
```

**Bước 3: Kiểm tra network**
```bash
# Test connection
mongosh "mongodb://localhost:27017/exe_project"

# Nếu không kết nối được, kiểm tra firewall
```

### 4. Lỗi Port đã được sử dụng

#### Triệu chứng:
- `Error: listen EADDRINUSE: address already in use :::5000`
- `Error: listen EADDRINUSE: address already in use :::3000`

#### Cách khắc phục:

**Bước 1: Tìm process đang sử dụng port**
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :5000
lsof -i :3000
```

**Bước 2: Kill process**
```bash
# Windows (thay PID bằng số thực tế)
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

**Bước 3: Thay đổi port**
```env
# Backend - thay đổi PORT trong .env
PORT=5001

# Frontend - thay đổi trong package.json
"scripts": {
  "dev": "next dev -p 3001"
}
```

### 5. Lỗi Build/Compile

#### Triệu chứng:
- `Module not found: Can't resolve`
- TypeScript compilation errors
- Build failed

#### Cách khắc phục:

**Bước 1: Kiểm tra TypeScript config**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Bước 2: Clear Next.js cache**
```bash
# Xóa .next folder
rm -rf .next

# Chạy lại
npm run dev
```

**Bước 3: Kiểm tra imports**
```typescript
// Đảm bảo import đúng path
import { Component } from '@/components/Component'
// Thay vì
import { Component } from '../../../components/Component'
```

### 6. Lỗi Authentication

#### Triệu chứng:
- Login không thành công
- Token không hợp lệ
- Session expired

#### Cách khắc phục:

**Bước 1: Kiểm tra JWT Secret**
```env
# Backend .env
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend .env.local
NEXTAUTH_SECRET=your-nextauth-secret-key
```

**Bước 2: Kiểm tra CORS**
```javascript
// Backend - đảm bảo credentials được allow
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Bước 3: Clear browser data**
```bash
# Clear cookies và localStorage
# F12 > Application > Storage > Clear storage
```

### 7. Lỗi File Upload

#### Triệu chứng:
- Không upload được file
- File size quá lớn
- Wrong file type

#### Cách khắc phục:

**Bước 1: Kiểm tra multer config**
```javascript
// Backend - multer config
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});
```

**Bước 2: Kiểm tra uploads folder**
```bash
# Tạo folder uploads nếu chưa có
mkdir uploads
mkdir uploads/banners
```

### 8. Lỗi Performance

#### Triệu chứng:
- App chạy chậm
- Memory usage cao
- CPU usage cao

#### Cách khắc phục:

**Bước 1: Optimize images**
```bash
# Sử dụng next/image cho optimization
import Image from 'next/image'
```

**Bước 2: Lazy loading**
```typescript
// Lazy load components
const LazyComponent = dynamic(() => import('./Component'), {
  loading: () => <p>Loading...</p>
})
```

**Bước 3: Database optimization**
```javascript
// Sử dụng indexes
db.products.createIndex({ name: 1 })
db.products.createIndex({ category: 1 })
```

## 🔍 Debug Tools

### 1. Network Debugging
```bash
# Kiểm tra API calls
curl -X GET http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

### 2. Database Debugging
```bash
# Kết nối MongoDB
mongosh mongodb://localhost:27017/exe_project

# Kiểm tra collections
show collections

# Kiểm tra documents
db.users.find().limit(5)
```

### 3. Frontend Debugging
```typescript
// Console logging
console.log('API Response:', response);

// Network tab trong DevTools
// F12 > Network > Xem API calls
```

## 📞 Hỗ trợ

Nếu vẫn gặp lỗi:

1. **Kiểm tra logs**:
   - Backend: Console output
   - Frontend: Browser Console (F12)
   - Database: MongoDB logs

2. **Tạo issue**:
   - Mô tả chi tiết lỗi
   - Screenshot error message
   - Steps to reproduce
   - Environment info (OS, Node version, etc.)

3. **Contact**:
   - GitHub Issues: https://github.com/TrungQuy2653/EXE_Project/issues
   - Email: [Your email]

## 🎯 Checklist trước khi báo lỗi

- [ ] Đã đọc hướng dẫn setup
- [ ] Đã thử các bước troubleshooting
- [ ] Đã kiểm tra logs
- [ ] Đã cung cấp thông tin môi trường
- [ ] Đã mô tả chi tiết lỗi
- [ ] Đã cung cấp steps to reproduce
