import express from 'express';
import { isAdmin } from '../controllers/auth.js';
import {
    createChessPiece,
    getChessPiecesByBanner,
    getChessPieceById,
    updateChessPiece,
    deleteChessPiece,
    getAllChessPieces
} from '../controllers/chessPiece.js';

const router = express.Router();

// Middleware upload file (sẽ được cấu hình sau)
const upload = (req, res, next) => {
    // Tạm thời để trống, sẽ cấu hình multer sau
    next();
};

// Public routes (không cần đăng nhập) - phải đặt trước routes có parameter
router.get('/banner/:bannerId', getChessPiecesByBanner); // Lấy quân cờ của một banner

// Admin routes (yêu cầu đăng nhập và quyền admin)
router.use(isAdmin);

// Chess piece management - đặt routes cụ thể trước routes có parameter
router.post('/', upload, createChessPiece);
router.get('/', getAllChessPieces);
router.get('/:id', getChessPieceById);
router.put('/:id', upload, updateChessPiece);
router.delete('/:id', deleteChessPiece);

export default router;
