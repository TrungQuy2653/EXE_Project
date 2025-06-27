import mongoose from "mongoose"

export const connectionDB = async (uri) => {
    try{
        await mongoose.connect(uri)
        console.log("Kết nối MongoDB thành công!");
        // Tạo admin mặc định nếu chưa có
        const User = (await import('../model/user.js')).default;
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const bcrypt = (await import('bcrypt')).default;
            const hashedPassword = await bcrypt.hash('123456', 10);
            await User.create({
                username: 'admin',
                email: 'admin01@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Đã tạo tài khoản admin mặc định!');
        }
    }catch (error){
        console.log(error);
    } 

};