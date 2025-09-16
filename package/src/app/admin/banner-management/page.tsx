'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface ChessPiece {
  _id: string;
  name: string;
  type: 'xe' | 'hậu' | 'mã' | 'tượng' | 'tốt' | 'vua';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  description: string;
}

interface Banner {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  theme: string;
  isActive: boolean;
  chessPieces: ChessPiece[];
  createdBy: {
    username: string;
    email: string;
  };
  releaseDate: string;
  endDate?: string;
  price: number;
  discount: number;
  createdAt: string;
  totalChessPieces?: number; // Added for total chess pieces
  rarityDistribution?: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

export default function BannerManagementPage() {
  const { user, token } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddPieceForm, setShowAddPieceForm] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: 'vietnam',
    price: 0,
    discount: 0,
    endDate: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pieceFormData, setPieceFormData] = useState({
    name: '',
    type: 'xe' as const,
    rarity: 'common' as const,
    description: '',
    dropRate: 10
  });

  useEffect(() => {
    if (token) {
      fetchBanners();
    }
  }, [token]);

  // Xử lý chọn ảnh
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }
      
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB!');
        return;
      }
      
      setSelectedImage(file);
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xóa ảnh đã chọn
  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const fetchBanners = async () => {
    try {
      console.log('📡 Fetching banners for admin...');
      const response = await fetch('http://localhost:5000/api/banners', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Admin banners response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Admin banners fetched successfully:', data);
        setBanners(data.banners);
      } else {
        const errorData = await response.json();
        console.error('❌ Error fetching admin banners:', response.status, errorData);
        const errorMessage = errorData.errors?.join(', ') || errorData.message || 'Không thể tải banners';
        alert(`Lỗi khi tải banners: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ Network error fetching admin banners:', error);
      alert('Lỗi kết nối khi tải banners! Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra ảnh bắt buộc
    if (!selectedImage) {
      alert('Vui lòng chọn ảnh banner!');
      return;
    }
    
    try {
      console.log('📝 Creating banner with data:', formData);
      console.log('📷 Selected image:', selectedImage.name);
      
      // Tạo FormData để gửi file
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('theme', formData.theme);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('discount', formData.discount.toString());
      if (formData.endDate) {
        formDataToSend.append('endDate', formData.endDate);
      }
      formDataToSend.append('coverImage', selectedImage);
      
      console.log('📡 Sending banner data with image...');
      
      const response = await fetch('http://localhost:5000/api/banners', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Không set Content-Type, để browser tự động set với boundary cho FormData
        },
        body: formDataToSend,
      });

      console.log('📡 Create banner response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Banner created successfully:', data);
        alert('Tạo banner thành công!');
        setShowCreateForm(false);
        setFormData({ name: '', description: '', theme: 'vietnam', price: 0, discount: 0, endDate: '' });
        clearImage();
        fetchBanners();
      } else {
        const errorData = await response.json();
        console.error('❌ Error creating banner:', response.status, errorData);
        const errorMessage = errorData.errors?.join(', ') || errorData.message || 'Không thể tạo banner';
        alert(`Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ Network error creating banner:', error);
      alert('Lỗi kết nối khi tạo banner! Vui lòng kiểm tra kết nối mạng.');
    }
  };

  const handleAddChessPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanner) return;

    try {
      console.log('📝 Adding chess piece with data:', pieceFormData);
      console.log('🎯 Adding to banner:', selectedBanner._id);
      
      const pieceData = {
        ...pieceFormData,
        image: 'https://via.placeholder.com/100x100?text=Chess+Piece', // Tạm thời dùng placeholder
        bannerId: selectedBanner._id, // Thêm bannerId vào body
        dropRate: pieceFormData.dropRate // Sử dụng dropRate từ form
      };
      
      console.log('📡 Sending chess piece data:', pieceData);
      console.log('🌐 API endpoint: http://localhost:5000/api/chess-pieces');
      
      const response = await fetch('http://localhost:5000/api/chess-pieces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pieceData),
      });

      console.log('📡 Add chess piece response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('✅ Chess piece added successfully:', data);
          alert('Thêm quân cờ thành công!');
          setShowAddPieceForm(false);
          setPieceFormData({ name: '', type: 'xe', rarity: 'common', description: '', dropRate: 10 });
          fetchBanners();
        } else {
          console.error('❌ Response is not JSON:', contentType);
          alert('Lỗi: Server trả về dữ liệu không đúng định dạng. Vui lòng kiểm tra backend!');
        }
      } else {
        try {
          const errorData = await response.json();
          console.error('❌ Error adding chess piece:', response.status, errorData);
          const errorMessage = errorData.errors?.join(', ') || errorData.message || 'Không thể thêm quân cờ';
          alert(`Lỗi: ${errorMessage}`);
        } catch (parseError) {
          console.error('❌ Cannot parse error response:', parseError);
          alert(`Lỗi khi thêm quân cờ: HTTP ${response.status}`);
        }
      }
    } catch (error) {
      console.error('❌ Network error adding chess piece:', error);
      alert('Lỗi kết nối khi thêm quân cờ! Vui lòng kiểm tra kết nối mạng và backend.');
    }
  };

  const toggleBannerStatus = async (bannerId: string, currentStatus: boolean) => {
    try {
      console.log('🔄 Toggling banner status:', bannerId, 'from', currentStatus, 'to', !currentStatus);
      
      const response = await fetch(`http://localhost:5000/api/banners/${bannerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      console.log('📡 Toggle banner status response:', response.status);

      if (response.ok) {
        console.log('✅ Banner status toggled successfully');
        fetchBanners();
      } else {
        const errorData = await response.json();
        console.error('❌ Error toggling banner status:', response.status, errorData);
        const errorMessage = errorData.errors?.join(', ') || errorData.message || 'Không thể cập nhật trạng thái banner';
        alert(`Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ Network error toggling banner status:', error);
      alert('Lỗi kết nối khi cập nhật trạng thái banner! Vui lòng kiểm tra kết nối mạng.');
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;

    try {
      console.log('🗑️ Deleting banner:', bannerId);
      
      const response = await fetch(`http://localhost:5000/api/banners/${bannerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Delete banner response:', response.status);

      if (response.ok) {
        console.log('✅ Banner deleted successfully');
        fetchBanners();
        alert('Đã xóa banner thành công!');
      } else {
        const errorData = await response.json();
        console.error('❌ Error deleting banner:', response.status, errorData);
        const errorMessage = errorData.errors?.join(', ') || errorData.message || 'Không thể xóa banner';
        alert(`Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ Network error deleting banner:', error);
      alert('Lỗi kết nối khi xóa banner! Vui lòng kiểm tra kết nối mạng.');
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Thường';
      case 'rare': return 'Hiếm';
      case 'epic': return 'Epic';
      case 'legendary': return 'Huyền thoại';
      default: return 'Thường';
    }
  };

  const testAPI = async () => {
    try {
      console.log('🧪 Testing API endpoints...');
      
      // Test health check
      const healthResponse = await fetch('http://localhost:5000/health');
      console.log('🏥 Health check status:', healthResponse.status);
      
      // Test API health
      const apiHealthResponse = await fetch('http://localhost:5000/api/health');
      console.log('🔌 API health status:', apiHealthResponse.status);
      
      if (apiHealthResponse.ok) {
        const apiHealthData = await apiHealthResponse.json();
        console.log('✅ API health data:', apiHealthData);
        
        // Test chess-pieces endpoint
        const chessResponse = await fetch('http://localhost:5000/api/chess-pieces', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('♟️ Chess pieces endpoint status:', chessResponse.status);
        
        if (chessResponse.ok) {
          console.log('✅ Chess pieces endpoint is working!');
        } else {
          console.log('❌ Chess pieces endpoint error:', chessResponse.status);
        }
      }
    } catch (error) {
      console.error('❌ API test failed:', error);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🎴 Quản lý Banner</h1>
                <p className="text-gray-600">Tạo và quản lý banner cho Mystery Box</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  🏠 Trang chủ
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  ← Dashboard
                </Link>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  + Tạo Banner Mới
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng Banner</p>
                  <p className="text-2xl font-semibold text-gray-900">{banners.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {banners.filter(b => b.isActive).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng quân cờ</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {banners.reduce((total, b) => total + (b.totalChessPieces || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng giá trị</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {banners.reduce((total, b) => total + b.price, 0).toLocaleString()}đ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Banners List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Danh sách Banner</h2>
                  <p className="text-sm text-gray-600">Quản lý tất cả banner trong hệ thống</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={testAPI}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    🧪 Test API
                  </button>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tạo Banner Mới
                  </button>
                </div>
              </div>
            </div>
            
            {banners.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có banner nào</h3>
                  <p className="mt-1 text-sm text-gray-500">Bắt đầu tạo banner đầu tiên để quản lý Mystery Box.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Tạo Banner Đầu Tiên
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Banner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quân cờ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {banners.map((banner) => (
                      <tr key={banner._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img
                                className="h-16 w-16 rounded-lg object-cover"
                                src={banner.coverImage.startsWith('http') ? banner.coverImage : `http://localhost:5000${banner.coverImage}`}
                                alt={banner.name}
                                onError={(e) => {
                                  // Fallback nếu ảnh không load được
                                  e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Banner';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{banner.name}</div>
                              <div className="text-sm text-gray-500">{banner.description}</div>
                              <div className="text-xs text-gray-400">Chủ đề: {banner.theme}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-2">
                            {(banner.totalChessPieces || 0) > 0 ? (
                              <>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Tổng: {banner.totalChessPieces || 0}
                                </span>
                                {(banner.rarityDistribution?.common || 0) > 0 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    Thường: {banner.rarityDistribution?.common || 0}
                                  </span>
                                )}
                                {(banner.rarityDistribution?.rare || 0) > 0 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                                    Hiếm: {banner.rarityDistribution?.rare || 0}
                                  </span>
                                )}
                                {(banner.rarityDistribution?.epic || 0) > 0 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                                    Epic: {banner.rarityDistribution?.epic || 0}
                                  </span>
                                )}
                                {(banner.rarityDistribution?.legendary || 0) > 0 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                                    Huyền thoại: {banner.rarityDistribution?.legendary || 0}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400 text-sm">Chưa có quân cờ</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            banner.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {banner.isActive ? '✅ Đang hoạt động' : '❌ Đã tắt'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(banner.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedBanner(banner);
                                setShowAddPieceForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              + Quân cờ
                            </button>
                            <button
                              onClick={() => toggleBannerStatus(banner._id, banner.isActive)}
                              className={`${
                                banner.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {banner.isActive ? 'Tắt' : 'Bật'}
                            </button>
                            <button
                              onClick={() => deleteBanner(banner._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Create Banner Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tạo Banner Mới</h3>
                <form onSubmit={handleCreateBanner} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên Banner</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ví dụ: Văn Lang"
                    />
                  </div>

                  {/* Upload Ảnh Banner */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Banner *</label>
                    
                    {/* File Input */}
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="banner-image"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Chọn ảnh banner</span>
                            <input
                              id="banner-image"
                              name="banner-image"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageSelect}
                            />
                          </label>
                          <p className="pl-1">hoặc kéo thả vào đây</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF tối đa 5MB
                        </p>
                      </div>
                    </div>

                    {/* Preview Ảnh */}
                    {imagePreview && (
                      <div className="mt-4">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-32 w-full object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedImage?.name} ({(selectedImage?.size! / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Mô tả về banner..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chủ đề</label>
                    <select
                      value={formData.theme}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="vietnam">Việt Nam</option>
                      <option value="ancient">Cổ đại</option>
                      <option value="modern">Hiện đại</option>
                      <option value="fantasy">Kỳ ảo</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giá</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giảm giá (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Tạo Banner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Chess Piece Modal */}
        {showAddPieceForm && selectedBanner && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Thêm Quân Cờ vào "{selectedBanner.name}"
                </h3>
                <form onSubmit={handleAddChessPiece} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên Quân Cờ</label>
                    <input
                      type="text"
                      required
                      value={pieceFormData.name}
                      onChange={(e) => setPieceFormData({ ...pieceFormData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ví dụ: Xe Văn Lang"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Loại</label>
                      <select
                        value={pieceFormData.type}
                        onChange={(e) => setPieceFormData({ ...pieceFormData, type: e.target.value as any })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="xe">Xe</option>
                        <option value="hậu">Hậu</option>
                        <option value="mã">Mã</option>
                        <option value="tượng">Tượng</option>
                        <option value="tốt">Tốt</option>
                        <option value="vua">Vua</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Độ hiếm</label>
                      <select
                        value={pieceFormData.rarity}
                        onChange={(e) => setPieceFormData({ ...pieceFormData, rarity: e.target.value as any })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="common">Thường</option>
                        <option value="rare">Hiếm</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Huyền thoại</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                      value={pieceFormData.description}
                      onChange={(e) => setPieceFormData({ ...pieceFormData, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Mô tả về quân cờ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Drop Rate (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={pieceFormData.dropRate}
                      onChange={(e) => setPieceFormData({ ...pieceFormData, dropRate: Number(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Tỷ lệ rơi của quân cờ (càng hiếm càng thấp)</p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddPieceForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Thêm Quân Cờ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
