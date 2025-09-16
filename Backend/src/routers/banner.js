import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { isAdmin } from '../controllers/auth.js';
import {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    getActiveBanners
} from '../controllers/banner.js';

const router = express.Router();

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/banners/');
        cb(null, uploadPath); // Thư mục lưu ảnh banner
    },
    filename: (req, file, cb) => {
        // Tạo tên file unique với timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter để chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép upload file ảnh!'), false);
    }
};

// Cấu hình multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    }
});

// Public routes (không cần đăng nhập) - phải đặt trước routes có parameter
router.get('/active', getActiveBanners); // Lấy banner active cho frontend

// Admin routes (yêu cầu đăng nhập và quyền admin)
router.use(isAdmin); // Áp dụng middleware kiểm tra admin cho tất cả routes bên dưới

// Banner management - đặt routes cụ thể trước routes có parameter
router.post('/', upload.single('coverImage'), createBanner);
router.get('/', getAllBanners);
router.get('/:id', getBannerById);
router.put('/:id', upload.single('coverImage'), updateBanner);
router.delete('/:id', deleteBanner);

export default router;
