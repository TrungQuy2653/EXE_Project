'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: ''  // Sửa thành confirmpassword để khớp với backend
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        console.log('🎉 Login successful!');
      } else {
        // Validation for register
        if (formData.password !== formData.confirmpassword) {
          setError('Mật khẩu xác nhận không khớp');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Mật khẩu phải có ít nhất 6 ký tự');
          setLoading(false);
          return;
        }

        await register(formData.username, formData.email, formData.password, formData.confirmpassword);
        console.log('🎉 Registration successful!');
      }
      
             // Đóng modal sau 1 giây để user thấy toast
       setTimeout(() => {
         onClose();
       }, 1000);
     } catch (err: any) {
       console.error('❌ Auth error:', err);
       // Hiển thị lỗi chi tiết hơn
       if (err.message) {
         setError(err.message);
       } else if (err.errors && Array.isArray(err.errors)) {
         setError(err.errors.join(', '));
       } else {
         setError('Có lỗi xảy ra, vui lòng thử lại');
       }
     } finally {
       setLoading(false);
     }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' ? (
              <>
                Hoặc{' '}
                <button
                  onClick={() => setFormData({ username: '', email: '', password: '', confirmpassword: '' })}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  đăng ký tài khoản mới
                </button>
              </>
            ) : (
              <>
                Hoặc{' '}
                <button
                  onClick={() => setFormData({ username: '', email: '', password: '', confirmpassword: '' })}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  đăng nhập nếu đã có tài khoản
                </button>
              </>
            )}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Tên người dùng
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên người dùng"
                minLength={3}
                maxLength={20}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={mode === 'login' ? 'Nhập mật khẩu' : 'Nhập mật khẩu (tối thiểu 6 ký tự)'}
              minLength={mode === 'register' ? 6 : undefined}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                required
                value={formData.confirmpassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập lại mật khẩu"
                minLength={6}
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                Tôi đồng ý với{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                  điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                  chính sách bảo mật
                </Link>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {mode === 'login' ? 'Đang đăng nhập...' : 'Đang tạo tài khoản...'}
                </span>
              </div>
            ) : (
              mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
