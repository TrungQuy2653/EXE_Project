import {registerSchema} from "../schema/auth";
import User from '../model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
const {username,email, password, confirmpassword, role} = req.body;
const {error} = registerSchema.validate(req.body,{abortEarly:false});
if(error) {
    return res.status(400).json({
        errors: error.details.map(e => e.message)
    });
}
// Kiểm tra email hoặc username đã tồn tại chưa
const exist = await User.findOne({ $or: [{ email }, { username }] });
if (exist) {
    return res.status(400).json({ errors: ["Email hoặc username đã tồn tại!"] });
}
// Hash password
const hashedPassword = await bcrypt.hash(password, 10);
// Xác định role: chỉ admin mới được tạo user với role admin
let newRole = 'user';
if (role === 'admin') {
    // Kiểm tra token và quyền admin
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ errors: ["Không có quyền tạo tài khoản admin!"] });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const currentUser = await User.findById(decoded.id);
        if (currentUser && currentUser.role === 'admin') {
            newRole = 'admin';
        } else {
            return res.status(403).json({ errors: ["Chỉ admin mới được tạo tài khoản admin!"] });
        }
    } catch (err) {
        return res.status(403).json({ errors: ["Token không hợp lệ!"] });
    }
}
// Lưu user mới
const user = await User.create({ username, email, password: hashedPassword, role: newRole });
return res.status(201).json({
    message: "Đăng ký thành công!",
    data: { id: user._id, username: user.username, email: user.email, role: user.role }
});
};

// Đăng nhập
export const signin = async (req, res) => {
    const { username, email, password } = req.body;
    // Tìm user theo username hoặc email
    const user = await User.findOne({ $or: [ { email }, { username } ] });
    if (!user) {
        return res.status(400).json({ errors: ["Tài khoản không tồn tại!"] });
    }
    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ errors: ["Sai mật khẩu!"] });
    }
    // Tạo token
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return res.status(200).json({
        message: "Đăng nhập thành công!",
        token,
        data: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
};

// Đăng xuất (logout)
export const logout = async (req, res) => {
    // Với JWT, logout phía backend chỉ đơn giản là thông báo thành công
    // (Client chỉ cần xoá token ở localStorage/cookie)
    return res.status(200).json({ message: "Đăng xuất thành công!" });
};

// Middleware kiểm tra admin
export const isAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ errors: ["Không có token!"] });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ errors: ["Chỉ admin mới được phép!"] });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ errors: ["Token không hợp lệ!"] });
    }
};

// Lấy danh sách user (chỉ admin)
export const getAllUsers = async (req, res) => {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (role) {
        query.role = role;
    }
    if (search) {
        query.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query, '-password')
        .skip(skip)
        .limit(parseInt(limit));
    const total = await User.countDocuments(query);
    return res.status(200).json({
        users,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit))
        }
    });
};

// Ban user (chỉ admin)
export const banUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ errors: ["Không tìm thấy user!"] });
    }
    if (user.role === 'admin') {
        return res.status(403).json({ errors: ["Không thể ban admin!"] });
    }
    user.role = 'banned';
    await user.save();
    return res.status(200).json({ message: "Đã ban user thành công!", user: { id: user._id, username: user.username, email: user.email, role: user.role } });
};