import Banner from '../model/banner.js';
import ChessPiece from '../model/chessPiece.js';

// Tạo banner mới
export const createBanner = async (req, res) => {
    try {
        console.log('🎯 Creating new banner...');
        console.log('📝 Request body:', req.body);
        console.log('📁 Uploaded file:', req.file);

        const { name, description, theme, price, discount, endDate } = req.body;
        
        // Xử lý coverImage
        let coverImage = '';
        if (req.file) {
            // Tạo URL để truy cập ảnh từ frontend
            coverImage = `/uploads/banners/${req.file.filename}`;
            console.log('📷 Uploaded image path:', coverImage);
        } else if (req.body.coverImage) {
            // Kiểm tra nếu là placeholder URL thì từ chối
            if (req.body.coverImage.includes('placeholder') || req.body.coverImage.includes('via.placeholder')) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể sử dụng placeholder URL làm ảnh banner! Vui lòng upload ảnh thực.'
                });
            }
            coverImage = req.body.coverImage;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Cover image là bắt buộc! Vui lòng upload ảnh banner.'
            });
        }

        // Kiểm tra banner đã tồn tại
        const existingBanner = await Banner.findOne({ name });
        if (existingBanner) {
            return res.status(400).json({
                success: false,
                message: 'Banner với tên này đã tồn tại!'
            });
        }

        const bannerData = {
            name,
            description,
            coverImage,
            theme,
            price: price ? Number(price) : 0,
            discount: discount ? Number(discount) : 0,
            endDate: endDate || null,
            createdBy: req.user.id,
            totalChessPieces: 0,
            rarityDistribution: {
                common: 0,
                rare: 0,
                epic: 0,
                legendary: 0
            }
        };

        const banner = new Banner(bannerData);
        await banner.save();

        console.log('✅ Banner created successfully:', banner);

        res.status(201).json({
            success: true,
            message: 'Tạo banner thành công!',
            banner
        });
    } catch (error) {
        console.error('❌ Error creating banner:', error);
        
        let errorMessage = 'Lỗi server khi tạo banner';
        
        if (error.name === 'ValidationError') {
            errorMessage = 'Dữ liệu không hợp lệ';
        } else if (error.name === 'CastError') {
            errorMessage = 'ID không hợp lệ';
        } else if (error.code === 11000) {
            errorMessage = 'Banner với tên này đã tồn tại';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Đã xảy ra lỗi'
        });
    }
};

// Lấy tất cả banners
export const getAllBanners = async (req, res) => {
    try {
        console.log('📋 Getting all banners...');
        
        const banners = await Banner.find()
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${banners.length} banners`);

        res.json({
            success: true,
            banners
        });
    } catch (error) {
        console.error('❌ Error getting banners:', error);
        
        let errorMessage = 'Lỗi server khi lấy banners';
        
        if (error.name === 'ValidationError') {
            errorMessage = 'Dữ liệu không hợp lệ';
        } else if (error.name === 'CastError') {
            errorMessage = 'ID không hợp lệ';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Đã xảy ra lỗi'
        });
    }
};

// Lấy banner theo ID
export const getBannerById = async (req, res) => {
    try {
        console.log('🔍 Getting banner by ID:', req.params.id);
        
        const banner = await Banner.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy banner!'
            });
        }

        console.log('✅ Banner found:', banner.name);

        res.json({
            success: true,
            banner
        });
    } catch (error) {
        console.error('❌ Error getting banner by ID:', error);
        
        let errorMessage = 'Lỗi server khi lấy banner';
        
        if (error.name === 'ValidationError') {
            errorMessage = 'Dữ liệu không hợp lệ';
        } else if (error.name === 'CastError') {
            errorMessage = 'ID không hợp lệ';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Đã xảy ra lỗi'
        });
    }
};

// Cập nhật banner
export const updateBanner = async (req, res) => {
    try {
        console.log('✏️ Updating banner:', req.params.id);
        console.log('📝 Update data:', req.body);

        const { name, description, theme, price, discount, endDate, isActive } = req.body;
        
        // Xử lý coverImage
        let updateData = { name, description, theme, price, discount, endDate, isActive };
        if (req.file) {
            // Tạo URL để truy cập ảnh từ frontend
            updateData.coverImage = `/uploads/banners/${req.file.filename}`;
            console.log('📷 Updated image path:', updateData.coverImage);
        } else if (req.body.coverImage) {
            updateData.coverImage = req.body.coverImage;
        }

        // Loại bỏ các giá trị undefined
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        const banner = await Banner.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy banner!'
            });
        }

        console.log('✅ Banner updated successfully:', banner.name);

        res.json({
            success: true,
            message: 'Cập nhật banner thành công!',
            banner
        });
    } catch (error) {
        console.error('❌ Error updating banner:', error);
        
        let errorMessage = 'Lỗi server khi cập nhật banner';
        
        if (error.name === 'ValidationError') {
            errorMessage = 'Dữ liệu không hợp lệ';
        } else if (error.name === 'CastError') {
            errorMessage = 'ID không hợp lệ';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Đã xảy ra lỗi'
        });
    }
};

// Xóa banner
export const deleteBanner = async (req, res) => {
    try {
        console.log('🗑️ Deleting banner:', req.params.id);

        // Kiểm tra xem banner có quân cờ nào không
        const chessPiecesCount = await ChessPiece.countDocuments({ banner: req.params.id });
        if (chessPiecesCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Không thể xóa banner! Còn ${chessPiecesCount} quân cờ trong banner này.`
            });
        }

        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy banner!'
            });
        }

        console.log('✅ Banner deleted successfully:', banner.name);

        res.json({
            success: true,
            message: 'Xóa banner thành công!'
        });
    } catch (error) {
        console.error('❌ Error deleting banner:', error);
        
        let errorMessage = 'Lỗi server khi xóa banner';
        
        if (error.name === 'ValidationError') {
            errorMessage = 'Dữ liệu không hợp lệ';
        } else if (error.name === 'CastError') {
            errorMessage = 'ID không hợp lệ';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Đã xảy ra lỗi'
        });
    }
};

// Lấy banners active (cho frontend)
export const getActiveBanners = async (req, res) => {
    try {
        console.log('🌟 Getting active banners...');
        
        // Lấy banners active
        const banners = await Banner.find({ isActive: true })
            .select('name description coverImage theme totalChessPieces rarityDistribution releaseDate')
            .sort({ createdAt: -1 });
            
        console.log('📊 Active banners found:', banners.length);
        banners.forEach(banner => {
            console.log(`- ${banner.name}: coverImage=${banner.coverImage}`);
        });

        // Cập nhật thống kê cho mỗi banner
        for (let banner of banners) {
            const chessPieces = await ChessPiece.find({ 
                banner: banner._id, 
                isActive: true 
            });
            
            if (banner.totalChessPieces !== chessPieces.length) {
                banner.totalChessPieces = chessPieces.length;
                
                // Tính toán phân bố độ hiếm
                const rarityCount = { common: 0, rare: 0, epic: 0, legendary: 0 };
                chessPieces.forEach(piece => {
                    if (piece.rarity && rarityCount.hasOwnProperty(piece.rarity)) {
                        rarityCount[piece.rarity]++;
                    }
                });
                
                banner.rarityDistribution = rarityCount;
                await banner.save();
                console.log(`✅ Updated banner ${banner.name} statistics`);
            }
        }

        // Debug: Log chi tiết về ảnh
        banners.forEach(banner => {
            if (banner.coverImage) {
                console.log(`🖼️ Banner ${banner.name}:`);
                console.log(`   - Cover Image Path: ${banner.coverImage}`);
                console.log(`   - Full URL would be: http://localhost:5000${banner.coverImage}`);
            } else {
                console.log(`❌ Banner ${banner.name} has no cover image!`);
            }
        });

        console.log(`✅ Found ${banners.length} banners`);

        res.json({
            success: true,
            banners
        });
    } catch (error) {
        console.error('❌ Error getting active banners:', error);
        
        let errorMessage = 'Lỗi server khi lấy active banners';
        
        if (error.name === 'ValidationError') {
            errorMessage = 'Dữ liệu không hợp lệ';
        } else if (error.name === 'CastError') {
            errorMessage = 'ID không hợp lệ';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Đã xảy ra lỗi'
        });
    }
};
