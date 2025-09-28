# 🚀 Hướng dẫn Setup EXE Project

## 📋 Yêu cầu hệ thống

### 1. Cài đặt phần mềm cần thiết

#### Node.js (Bắt buộc)
- **Tải về**: https://nodejs.org/
- **Phiên bản khuyến nghị**: Node.js 18.x hoặc 20.x
- **Kiểm tra**: Mở Command Prompt/PowerShell và chạy:
  ```bash
  node --version
  npm --version
  ```

#### MongoDB (Bắt buộc cho Backend)
- **Tải về**: https://www.mongodb.com/try/download/community
- **Hoặc sử dụng MongoDB Atlas** (cloud): https://www.mongodb.com/atlas
- **Kiểm tra**: Mở Command Prompt và chạy:
  ```bash
  mongod --version
  ```

#### Git (Bắt buộc)
- **Tải về**: https://git-scm.com/
- **Kiểm tra**: Mở Command Prompt và chạy:
  ```bash
  git --version
  ```

## 🔧 Các bước setup

### Bước 1: Clone repository
```bash
git clone https://github.com/TrungQuy2653/EXE_Project.git
cd EXE_Project
```

### Bước 2: Setup Backend (BE)

1. **Vào thư mục Backend**:
   ```bash
   cd BE/Backend
   ```

2. **Chạy script setup tự động**:
   ```bash
   setup.bat
   ```
   
   **Hoặc setup thủ công**:
   ```bash
   # Cài đặt dependencies
   npm install
   
   # Tạo file .env từ template
   copy env.example .env
   
   # Chỉnh sửa file .env nếu cần
   notepad .env
   ```

3. **Khởi động MongoDB**:
   - Nếu cài MongoDB local: Khởi động MongoDB service
   - Nếu dùng MongoDB Atlas: Cập nhật connection string trong `.env`

4. **Chạy Backend**:
   ```bash
   npm start
   ```
   
   **Kiểm tra**: Mở trình duyệt và truy cập http://localhost:5000/api/health

### Bước 3: Setup Frontend (EXE_Project-develop)

1. **Mở terminal mới và vào thư mục Frontend**:
   ```bash
   cd EXE_Project-develop/package
   ```

2. **Chạy script setup tự động**:
   ```bash
   setup.bat
   ```
   
   **Hoặc setup thủ công**:
   ```bash
   # Cài đặt dependencies
   npm install
   
   # Tạo file .env.local từ template
   copy env.example .env.local
   
   # Chỉnh sửa file .env.local nếu cần
   notepad .env.local
   ```

3. **Chạy Frontend**:
   ```bash
   npm run dev
   ```
   
   **Kiểm tra**: Mở trình duyệt và truy cập http://localhost:3000

## 🔧 Cấu hình Environment Variables

### Backend (.env)
```env
# Database Configuration
DB_URI=mongodb://localhost:27017/exe_project
# Hoặc MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/exe_project

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Admin Configuration
ADMIN_EMAIL=admin@exe.com
ADMIN_PASSWORD=admin123
```

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Development
NODE_ENV=development
```

## 🚨 Xử lý lỗi thường gặp

### 1. Lỗi "fail to fetch" hoặc "Network Error"
**Nguyên nhân**: Backend chưa chạy hoặc CORS chưa được cấu hình

**Giải pháp**:
```bash
# Kiểm tra Backend có chạy không
curl http://localhost:5000/api/health

# Nếu không chạy, khởi động Backend
cd BE/Backend
npm start
```

### 2. Lỗi "Cannot find module"
**Nguyên nhân**: Dependencies chưa được cài đặt

**Giải pháp**:
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Hoặc trên Windows
rmdir /s node_modules
del package-lock.json
npm install
```

### 3. Lỗi MongoDB connection
**Nguyên nhân**: MongoDB chưa chạy hoặc connection string sai

**Giải pháp**:
```bash
# Kiểm tra MongoDB có chạy không
mongosh --eval "db.adminCommand('ping')"

# Nếu không chạy, khởi động MongoDB
# Windows: net start MongoDB
# Linux/Mac: sudo systemctl start mongod
```

### 4. Lỗi Port đã được sử dụng
**Nguyên nhân**: Port 3000 hoặc 5000 đã được sử dụng

**Giải pháp**:
```bash
# Tìm process đang sử dụng port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process (thay PID bằng số thực tế)
taskkill /PID <PID> /F

# Hoặc thay đổi port trong .env
```

### 5. Lỗi "Module not found" trong Frontend
**Nguyên nhân**: Dependencies không đầy đủ hoặc cache bị lỗi

**Giải pháp**:
```bash
# Clear cache và cài lại
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Hoặc sử dụng yarn
yarn install
```

## 📝 Scripts hữu ích

### Backend
```bash
npm start          # Chạy server production
npm run dev        # Chạy server development (nếu có)
npm run setup      # Chạy script setup
```

### Frontend
```bash
npm run dev        # Chạy development server
npm run build      # Build cho production
npm run start      # Chạy production server
npm run lint       # Kiểm tra code style
```

## 🔍 Kiểm tra hệ thống

### 1. Kiểm tra Backend
```bash
# Health check
curl http://localhost:5000/api/health

# Kiểm tra API endpoints
curl http://localhost:5000/api/products
```

### 2. Kiểm tra Frontend
- Mở http://localhost:3000
- Kiểm tra Console trong Developer Tools (F12)
- Kiểm tra Network tab để xem API calls

### 3. Kiểm tra Database
```bash
# Kết nối MongoDB
mongosh mongodb://localhost:27017/exe_project

# Kiểm tra collections
show collections
```

## 🚀 Chạy toàn bộ hệ thống

### Terminal 1 - Backend
```bash
cd BE/Backend
npm start
```

### Terminal 2 - Frontend
```bash
cd EXE_Project-develop/package
npm run dev
```

### Terminal 3 - MongoDB (nếu cần)
```bash
mongod
```

## 📞 Hỗ trợ

Nếu gặp lỗi không giải quyết được:
1. Kiểm tra log trong Console
2. Kiểm tra Network tab trong Developer Tools
3. Đảm bảo tất cả services đang chạy
4. Kiểm tra firewall/antivirus có chặn port không

## 🎯 Kết quả mong đợi

Sau khi setup thành công:
- ✅ Backend chạy trên http://localhost:5000
- ✅ Frontend chạy trên http://localhost:3000
- ✅ Database kết nối thành công
- ✅ API calls hoạt động bình thường
- ✅ Không có lỗi "fail to fetch"
