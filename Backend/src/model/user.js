import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, trim: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    role: {type: String, enum: ['user', 'admin', 'banned'], default: 'user', required: true}
}
, {timestamps: true, versionKey: false });

userSchema.index({username: 1, email: 1});
export default mongoose.model('User', userSchema); 