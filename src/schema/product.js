import Joi from 'joi';

export const productSchema = Joi.object({
    type: Joi.string().valid('Xe', 'Tượng', 'Mã', 'Vua', 'Hậu').required().messages({
        'any.required': 'Loại quân cờ là bắt buộc',
        'any.only': 'Loại quân cờ không hợp lệ'
    }),
    name: Joi.string().required().messages({
        'any.required': 'Tên quân cờ là bắt buộc',
        'string.empty': 'Tên quân cờ không được để trống'
    }),
    rarity: Joi.string().required().messages({
        'any.required': 'Độ hiếm là bắt buộc',
        'string.empty': 'Độ hiếm không được để trống'
    }),
    image: Joi.string().required().messages({
        'any.required': 'Hình ảnh là bắt buộc',
        'string.empty': 'Hình ảnh không được để trống'
    })
}); 