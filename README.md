# 🎮 EXE Project - Full Stack Application

## 📖 Giới thiệu

EXE Project là một ứng dụng full-stack được xây dựng với:
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: NextAuth.js
- **3D Graphics**: Three.js + React Three Fiber

## 🏗️ Cấu trúc dự án

```
EXE_Project/
├── BE/                          # Backend (Node.js + Express)
│   └── Backend/
│       ├── src/
│       │   ├── controllers/     # API Controllers
│       │   ├── models/          # Database Models
│       │   ├── routers/         # API Routes
│       │   └── config/         # Database Config
│       ├── uploads/            # File Uploads
│       └── server.js           # Main Server File
│
├── EXE_Project-develop/         # Frontend (Next.js)
│   └── package/
│       ├── src/
│       │   ├── app/            # Next.js App Router
│       │   ├── components/     # React Components
│       │   └── contexts/       # React Contexts
│       └── public/            # Static Assets
│
└── SETUP_GUIDE.md             # Hướng dẫn setup chi tiết
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/TrungQuy2653/EXE_Project.git
cd EXE_Project
```

### 2. Setup Backend
```bash
cd BE/Backend
setup.bat  # Windows
# hoặc
npm install
npm start
```

### 3. Setup Frontend
```bash
cd EXE_Project-develop/package
setup.bat  # Windows
# hoặc
npm install
npm run dev
```

### 4. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📋 Yêu cầu hệ thống

- **Node.js**: 18.x hoặc 20.x
- **MongoDB**: Local hoặc Atlas
- **Git**: Để clone repository

## 🔧 Cấu hình

### Backend Environment (.env)
```env
DB_URI=mongodb://localhost:27017/exe_project
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

### Frontend Environment (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

## 🚨 Xử lý lỗi

### Lỗi "fail to fetch"
1. Kiểm tra Backend có chạy không: `curl http://localhost:5000/api/health`
2. Kiểm tra CORS configuration
3. Kiểm tra firewall/antivirus

### Lỗi Dependencies
```bash
# Clear cache và cài lại
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Lỗi MongoDB
1. Kiểm tra MongoDB có chạy không
2. Kiểm tra connection string trong .env
3. Kiểm tra network connectivity

## 📚 Tài liệu chi tiết

Xem [SETUP_GUIDE.md](./SETUP_GUIDE.md) để có hướng dẫn setup chi tiết và xử lý lỗi.

## 🛠️ Scripts

### Backend
```bash
npm start          # Chạy server
npm run setup      # Setup tự động
```

### Frontend
```bash
npm run dev        # Development server
npm run build      # Build production
npm run start      # Production server
npm run lint       # Code linting
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Thông tin user

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

### Banners
- `GET /api/banners` - Lấy danh sách banner
- `POST /api/banners` - Tạo banner mới
- `PUT /api/banners/:id` - Cập nhật banner
- `DELETE /api/banners/:id` - Xóa banner

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- **Repository**: https://github.com/TrungQuy2653/EXE_Project
- **Issues**: https://github.com/TrungQuy2653/EXE_Project/issues

## 🎯 Tính năng chính

- ✅ Authentication & Authorization
- ✅ Product Management
- ✅ Banner Management
- ✅ User Management
- ✅ 3D Model Viewer
- ✅ Responsive Design
- ✅ Admin Dashboard
- ✅ File Upload
- ✅ API Documentation
