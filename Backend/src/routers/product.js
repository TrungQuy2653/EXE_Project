import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.js';

const router = express.Router();

// Tạo sản phẩm mới
router.post('/', createProduct);
// Lấy danh sách sản phẩm
router.get('/', getAllProducts);
// Lấy sản phẩm theo id
router.get('/:id', getProductById);
// Cập nhật sản phẩm
router.put('/:id', updateProduct);
// Xóa sản phẩm
router.delete('/:id', deleteProduct);

export default router; 