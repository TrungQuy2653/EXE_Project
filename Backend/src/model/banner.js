import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    }, // Tên banner: "Văn Lang", "Đại Việt", v.v.
    
    description: { 
        type: String, 
        default: '' 
    }, // Mô tả banner
    
    coverImage: { 
        type: String, 
        required: true 
    }, // Ảnh bìa banner
    
    theme: { 
        type: String, 
        default: 'vietnam' 
    }, // Chủ đề banner
    
    isActive: { 
        type: Boolean, 
        default: true 
    }, // Trạng thái hoạt động
    
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Admin tạo banner
    
    releaseDate: { 
        type: Date, 
        default: Date.now 
    }, // Ngày phát hành
    
    endDate: { 
        type: Date 
    }, // Ngày kết thúc (nếu có)
    
    price: { 
        type: Number, 
        default: 0 
    }, // Giá banner (nếu có)
    
    discount: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 100 
    }, // Giảm giá (%)
    
    totalChessPieces: {
        type: Number,
        default: 0
    }, // Tổng số quân cờ trong banner
    
    rarityDistribution: {
        common: { type: Number, default: 0 },
        rare: { type: Number, default: 0 },
        epic: { type: Number, default: 0 },
        legendary: { type: Number, default: 0 }
    } // Phân bố độ hiếm của quân cờ
}, { 
    timestamps: true, 
    versionKey: false 
});

// Index để tìm kiếm nhanh
bannerSchema.index({ name: 1, theme: 1, isActive: 1 });
bannerSchema.index({ releaseDate: 1 });

export default mongoose.model('Banner', bannerSchema);
