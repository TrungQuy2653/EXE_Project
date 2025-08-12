import mongoose from 'mongoose';

export const connectionDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log('Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('Lỗi kết nối MongoDB:', error);
        process.exit(1);
    }
}; 