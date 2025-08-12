import {registerSchema} from "../schema/auth.js";
import User from '../model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
console.log('📝 Signup request body:', req.body);
const {username,email, password, confirmpassword, role} = req.body;
const {error} = registerSchema.validate(req.body,{abortEarly:false});
if(error) {
    console.log('❌ Validation error:', error.details);
    return res.status(400).json({
        errors: error.details.map(e => e.message)
    });
}
// Kiểm tra email hoặc username đã tồn tại chưa
let exist;
try {
    exist = await User.findOne({ $or: [{ email }, { username }] });
    if (exist) {
        return res.status(400).json({ errors: ["Email hoặc username đã tồn tại!"] });
    }
    console.log('✅ Username and email are available');
} catch (dbError) {
    console.error('❌ Database error checking existing user:', dbError);
    return res.status(500).json({ errors: ["Lỗi database, vui lòng thử lại"] });
}
// Hash password
let hashedPassword;
try {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');
} catch (bcryptError) {
    console.error('❌ Bcrypt hash error:', bcryptError);
    return res.status(500).json({ errors: ["Lỗi mã hóa mật khẩu, vui lòng thử lại"] });
}
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
        let currentUser;
        try {
            currentUser = await User.findById(decoded.id);
            if (currentUser && currentUser.role === 'admin') {
            newRole = 'admin';
            console.log('✅ Admin role granted by:', currentUser.username);
                    } else {
                return res.status(403).json({ errors: ["Chỉ admin mới được tạo tài khoản admin!"] });
            }
        } catch (dbError) {
            console.error('❌ Database error checking admin:', dbError);
            return res.status(500).json({ errors: ["Lỗi database, vui lòng thử lại"] });
        }
    } catch (err) {
        console.error('❌ JWT verification error:', err);
        return res.status(403).json({ errors: ["Token không hợp lệ!"] });
    }
}
// Lưu user mới
let user;
try {
    user = await User.create({ username, email, password: hashedPassword, role: newRole });
    console.log('✅ User created successfully:', user._id);
} catch (dbError) {
    console.error('❌ Database error:', dbError);
    return res.status(500).json({ errors: ["Lỗi database, vui lòng thử lại"] });
}

// Tạo token sau khi đăng ký thành công
let token;
try {
    token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    console.log('✅ JWT token created successfully');
} catch (jwtError) {
    console.error('❌ JWT error:', jwtError);
    return res.status(500).json({ errors: ["Lỗi tạo token, vui lòng thử lại"] });
}

const response = {
    message: "Đăng ký thành công!",
    token,
    data: { id: user._id, username: user.username, email: user.email, role: user.role }
};
console.log('✅ Signup response:', response);
return res.status(201).json(response);
};

// Đăng nhập
export const signin = async (req, res) => {
    console.log('🔐 Signin request body:', req.body);
    const { username, email, password } = req.body;
    // Tìm user theo username hoặc email
    let user;
    try {
        user = await User.findOne({ $or: [ { email }, { username } ] });
        if (!user) {
            return res.status(400).json({ errors: ["Tài khoản không tồn tại!"] });
        }
        console.log('✅ User found:', user._id);
    } catch (dbError) {
        console.error('❌ Database error during signin:', dbError);
        return res.status(500).json({ errors: ["Lỗi database, vui lòng thử lại"] });
    }
    // So sánh password
    let isMatch;
    try {
        isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: ["Sai mật khẩu!"] });
        }
        console.log('✅ Password verified successfully');
    } catch (bcryptError) {
        console.error('❌ Bcrypt error:', bcryptError);
        return res.status(500).json({ errors: ["Lỗi xác thực mật khẩu, vui lòng thử lại"] });
    }
    // Tạo token
    let token;
    try {
        token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        console.log('✅ JWT token created successfully for signin');
    } catch (jwtError) {
        console.error('❌ JWT error during signin:', jwtError);
        return res.status(500).json({ errors: ["Lỗi tạo token, vui lòng thử lại"] });
    }
    const response = {
        message: "Đăng nhập thành công!",
        token,
        data: { id: user._id, username: user.username, email: user.email, role: user.role }
    };
    console.log('✅ Signin response:', response);
    return res.status(200).json(response);
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