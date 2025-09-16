import ChessPiece from '../model/chessPiece.js';
import Banner from '../model/banner.js';

// Tạo quân cờ mới
export const createChessPiece = async (req, res) => {
    try {
        console.log('🎯 Creating new chess piece...');
        console.log('📝 Request body:', req.body);
        console.log('📁 Uploaded file:', req.file);

        const { name, type, rarity, description, dropRate, bannerId } = req.body;
        
        // Xử lý image
        let image = '';
        if (req.file) {
            image = req.file.path || req.file.filename;
        } else if (req.body.image) {
            image = req.body.image;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Hình ảnh quân cờ là bắt buộc!'
            });
        }

        // Kiểm tra banner tồn tại
        const banner = await Banner.findById(bannerId);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy banner!'
            });
        }

        // Kiểm tra quân cờ đã tồn tại trong banner
        const existingPiece = await ChessPiece.findOne({ 
            name, 
            banner: bannerId 
        });
        if (existingPiece) {
            return res.status(400).json({
                success: false,
                message: 'Quân cờ này đã tồn tại trong banner!'
            });
        }

        const chessPieceData = {
            name,
            type,
            rarity,
            image,
            description: description || '',
            dropRate: dropRate ? Number(dropRate) : 10,
            banner: bannerId,
            createdBy: req.user.id
        };

        const chessPiece = new ChessPiece(chessPieceData);
        await chessPiece.save();

        // Cập nhật thống kê banner
        banner.totalChessPieces += 1;
        banner.rarityDistribution[rarity] += 1;
        await banner.save();

        console.log('✅ Chess piece created successfully:', chessPiece);

        res.status(201).json({
            success: true,
            message: 'Tạo quân cờ thành công!',
            chessPiece
        });
    } catch (error) {
        console.error('❌ Error creating chess piece:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo quân cờ',
            error: error.message
        });
    }
};

// Lấy tất cả quân cờ của một banner
export const getChessPiecesByBanner = async (req, res) => {
    try {
        console.log('📋 Getting chess pieces for banner:', req.params.bannerId);
        
        const chessPieces = await ChessPiece.find({ 
            banner: req.params.bannerId,
            isActive: true 
        }).sort({ rarity: 1, name: 1 });

        console.log(`✅ Found ${chessPieces.length} chess pieces`);

        res.json({
            success: true,
            chessPieces
        });
    } catch (error) {
        console.error('❌ Error getting chess pieces:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy quân cờ',
            error: error.message
        });
    }
};

// Lấy quân cờ theo ID
export const getChessPieceById = async (req, res) => {
    try {
        console.log('🔍 Getting chess piece by ID:', req.params.id);
        
        const chessPiece = await ChessPiece.findById(req.params.id)
            .populate('banner', 'name theme')
            .populate('createdBy', 'username');

        if (!chessPiece) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy quân cờ!'
            });
        }

        console.log('✅ Chess piece found:', chessPiece.name);

        res.json({
            success: true,
            chessPiece
        });
    } catch (error) {
        console.error('❌ Error getting chess piece:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy quân cờ',
            error: error.message
        });
    }
};

// Cập nhật quân cờ
export const updateChessPiece = async (req, res) => {
    try {
        console.log('✏️ Updating chess piece:', req.params.id);
        console.log('📝 Update data:', req.body);

        const { name, type, rarity, description, dropRate, isActive } = req.body;
        
        // Xử lý image
        let updateData = { name, type, rarity, description, dropRate, isActive };
        if (req.file) {
            updateData.image = req.file.path || req.file.filename;
        } else if (req.body.image) {
            updateData.image = req.body.image;
        }

        // Loại bỏ các giá trị undefined
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        const chessPiece = await ChessPiece.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!chessPiece) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy quân cờ!'
            });
        }

        console.log('✅ Chess piece updated successfully:', chessPiece.name);

        res.json({
            success: true,
            message: 'Cập nhật quân cờ thành công!',
            chessPiece
        });
    } catch (error) {
        console.error('❌ Error updating chess piece:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật quân cờ',
            error: error.message
        });
    }
};

// Xóa quân cờ
export const deleteChessPiece = async (req, res) => {
    try {
        console.log('🗑️ Deleting chess piece:', req.params.id);

        const chessPiece = await ChessPiece.findById(req.params.id);
        if (!chessPiece) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy quân cờ!'
            });
        }

        // Cập nhật thống kê banner
        const banner = await Banner.findById(chessPiece.banner);
        if (banner) {
            banner.totalChessPieces = Math.max(0, banner.totalChessPieces - 1);
            banner.rarityDistribution[chessPiece.rarity] = Math.max(0, banner.rarityDistribution[chessPiece.rarity] - 1);
            await banner.save();
        }

        await ChessPiece.findByIdAndDelete(req.params.id);

        console.log('✅ Chess piece deleted successfully:', chessPiece.name);

        res.json({
            success: true,
            message: 'Xóa quân cờ thành công!'
        });
    } catch (error) {
        console.error('❌ Error deleting chess piece:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa quân cờ',
            error: error.message
        });
    }
};

// Lấy tất cả quân cờ (cho admin)
export const getAllChessPieces = async (req, res) => {
    try {
        console.log('📋 Getting all chess pieces...');
        
        const { page = 1, limit = 20, rarity, type, banner } = req.query;
        
        const query = {};
        if (rarity) query.rarity = rarity;
        if (type) query.type = type;
        if (banner) query.banner = banner;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const chessPieces = await ChessPiece.find(query)
            .populate('banner', 'name theme')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await ChessPiece.countDocuments(query);

        console.log(`✅ Found ${chessPieces.length} chess pieces (Total: ${total})`);

        res.json({
            success: true,
            chessPieces,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('❌ Error getting chess pieces:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy quân cờ',
            error: error.message
        });
    }
};
