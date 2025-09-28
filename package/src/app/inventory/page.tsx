'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface InventoryItem {
  _id: string;
  chessPiece: {
    name: string;
    type: string;
    rarity: string;
    image: string;
    description: string;
  };
  banner: {
    name: string;
    theme: string;
  };
  obtainedAt: string;
  isEquipped: boolean;
  isFavorite: boolean;
  condition: string;
}

interface InventoryStats {
  totalItems: number;
  boxesOpened: number;
  rarityStats: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  typeStats: {
    xe: number;
    hậu: number;
    mã: number;
    tượng: number;
    tốt: number;
    vua: number;
  };
  equippedItems: number;
  favoriteItems: number;
}

export default function InventoryPage() {
  const { user, token } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, favorite, equipped
  const [sortBy, setSortBy] = useState('obtainedAt'); // obtainedAt, rarity, type, name
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    if (user && token) {
      console.log('🔄 useEffect triggered - user:', user.username, 'token exists:', !!token);
      fetchInventory();
      fetchInventoryStats();
    } else {
      console.log('⚠️ useEffect skipped - user:', user?.username, 'token exists:', !!token);
    }
  }, [user, token]);

  const fetchInventory = async () => {
    try {
      console.log('🔍 Fetching inventory with token:', token ? 'Valid token' : 'No token');
      const response = await fetch('http://localhost:5000/api/mystery-box/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Inventory response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Inventory data received:', data);
        console.log('📦 Items count:', data.items?.length || 0);
        console.log('📋 First item sample:', data.items?.[0]);
        
        if (data.items && Array.isArray(data.items)) {
          setInventory(data.items);
          console.log('✅ Inventory state updated with', data.items.length, 'items');
        } else {
          console.error('❌ Invalid items format:', data);
          setInventory([]);
        }
      } else {
        console.error('❌ Inventory response error:', response.status, response.statusText);
        try {
          const errorData = await response.json();
          console.error('❌ Error details:', errorData);
        } catch (e) {
          console.error('❌ Could not parse error response');
        }
        setInventory([]);
      }
    } catch (error) {
      console.error('❌ Network error fetching inventory:', error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryStats = async () => {
    try {
      console.log('📊 Fetching inventory stats...');
      const response = await fetch('http://localhost:5000/api/mystery-box/inventory/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Stats response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Stats data received:', data);
        setStats(data);
      } else {
        console.error('❌ Stats response error:', response.status, response.statusText);
        try {
          const errorData = await response.json();
          console.error('❌ Stats error details:', errorData);
        } catch (e) {
          console.error('❌ Could not parse stats error response');
        }
      }
    } catch (error) {
      console.error('❌ Network error fetching stats:', error);
    }
  };

  const toggleFavorite = async (itemId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/mystery-box/inventory/items/${itemId}/favorite`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // Cập nhật local state
        setInventory(prev => prev.map(item => 
          item._id === itemId 
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        ));
        // Refresh stats
        fetchInventoryStats();
      }
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
    }
  };

  const toggleEquip = async (itemId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/mystery-box/inventory/items/${itemId}/equip`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // Cập nhật local state
        setInventory(prev => prev.map(item => 
          item._id === itemId 
            ? { ...item, isEquipped: !item.isEquipped }
            : item
        ));
        // Refresh stats
        fetchInventoryStats();
      }
    } catch (error) {
      console.error('❌ Error toggling equip:', error);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Thường';
      case 'rare': return 'Hiếm';
      case 'epic': return 'Epic';
      case 'legendary': return 'Huyền thoại';
      default: return rarity;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'xe': return '♜';
      case 'hậu': return '♛';
      case 'mã': return '♞';
      case 'tượng': return '♝';
      case 'tốt': return '♟';
      case 'vua': return '♚';
      default: return '♟';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'xe': return 'bg-red-100 text-red-800 border-red-300';
      case 'hậu': return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'mã': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'tượng': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'tốt': return 'bg-green-100 text-green-800 border-green-300';
      case 'vua': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Filter và sort inventory
  const filteredAndSortedInventory = (inventory || [])
    .filter(item => {
      // Filter by search term
      if (searchTerm && !item.chessPiece.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by favorite/equipped
      if (filter === 'favorite' && !item.isFavorite) return false;
      if (filter === 'equipped' && !item.isEquipped) return false;
      
      // Filter by rarity
      if (selectedRarity !== 'all' && item.chessPiece.rarity !== selectedRarity) return false;
      
      // Filter by type
      if (selectedType !== 'all' && item.chessPiece.type !== selectedType) return false;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
          return rarityOrder[b.chessPiece.rarity as keyof typeof rarityOrder] - rarityOrder[a.chessPiece.rarity as keyof typeof rarityOrder];
        case 'type':
          return a.chessPiece.type.localeCompare(b.chessPiece.type);
        case 'name':
          return a.chessPiece.name.localeCompare(b.chessPiece.name);
        case 'obtainedAt':
        default:
          return new Date(b.obtainedAt).getTime() - new Date(a.obtainedAt).getTime();
      }
    });

  // Debug information
  console.log('🔍 Current inventory state:', {
    inventory: inventory,
    inventoryLength: inventory?.length || 0,
    filteredLength: filteredAndSortedInventory.length,
    searchTerm,
    filter,
    selectedRarity,
    selectedType,
    sortBy
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📦 Inventory</h1>
              <p className="mt-2 text-gray-600">Quản lý quân cờ đã nhận được!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                🏠 Trang chủ
              </Link>
              {stats && (
                <div className="text-right text-sm text-gray-600">
                  <p>Tổng items: <span className="font-semibold">{stats?.totalItems || 0}</span></p>
                  <p>Hộp đã mở: <span className="font-semibold">{stats?.boxesOpened || 0}</span></p>
                </div>
              )}
              <button
                onClick={() => {
                  setLoading(true);
                  fetchInventory();
                  fetchInventoryStats();
                }}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                disabled={loading}
              >
                {loading ? '🔄 Đang tải...' : '🔄 Làm mới'}
              </button>
              <Link
                href="/mystery-box"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
              >
                🎁 Mở hộp mới
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center border-l-4 border-gray-400">
              <div className="text-2xl font-bold text-gray-900">{stats.totalItems}</div>
              <div className="text-sm text-gray-600">Tổng items</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center border-l-4 border-yellow-400">
              <div className="text-2xl font-bold text-yellow-600">{stats?.rarityStats?.legendary || 0}</div>
              <div className="text-sm text-gray-600">Huyền thoại</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center border-l-4 border-purple-400">
              <div className="text-2xl font-bold text-purple-600">{stats?.rarityStats?.epic || 0}</div>
              <div className="text-sm text-gray-600">Epic</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center border-l-4 border-blue-400">
              <div className="text-2xl font-bold text-blue-600">{stats?.rarityStats?.rare || 0}</div>
              <div className="text-sm text-gray-600">Hiếm</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center border-l-4 border-gray-400">
              <div className="text-2xl font-bold text-gray-600">{stats?.rarityStats?.common || 0}</div>
              <div className="text-sm text-gray-600">Thường</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center border-l-4 border-green-400">
              <div className="text-2xl font-bold text-green-600">{stats?.equippedItems || 0}</div>
              <div className="text-sm text-gray-600">Đang trang bị</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center border-l-4 border-red-400">
              <div className="text-2xl font-bold text-red-600">{stats?.favoriteItems || 0}</div>
              <div className="text-sm text-gray-600">Yêu thích</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center border-l-4 border-indigo-400">
              <div className="text-2xl font-bold text-indigo-600">{stats?.boxesOpened || 0}</div>
              <div className="text-sm text-gray-600">Hộp đã mở</div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Debug Panel - Remove this in production */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm:</label>
              <input
                type="text"
                placeholder="Tìm theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            {/* Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lọc:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">Tất cả</option>
                <option value="favorite">Yêu thích</option>
                <option value="equipped">Đang trang bị</option>
              </select>
            </div>

            {/* Rarity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Độ hiếm:</label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">Tất cả</option>
                <option value="common">Thường</option>
                <option value="rare">Hiếm</option>
                <option value="epic">Epic</option>
                <option value="legendary">Huyền thoại</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại quân cờ:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">Tất cả</option>
                <option value="xe">Xe</option>
                <option value="hậu">Hậu</option>
                <option value="mã">Mã</option>
                <option value="tượng">Tượng</option>
                <option value="tốt">Tốt</option>
                <option value="vua">Vua</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="obtainedAt">Ngày nhận</option>
                  <option value="rarity">Độ hiếm</option>
                  <option value="type">Loại quân cờ</option>
                  <option value="name">Tên</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chế độ xem:</label>
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ⊞
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Hiển thị {filteredAndSortedInventory.length} / {(inventory || []).length} items
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredAndSortedInventory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {!inventory || inventory.length === 0 ? 'Chưa có items nào' : 'Không tìm thấy items phù hợp'}
            </h3>
            <p className="text-gray-600 mb-4">
              {!inventory || inventory.length === 0 
                ? 'Hãy mở hộp mystery box để nhận quân cờ đầu tiên!' 
                : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              }
            </p>
            
            {/* Additional debug info */}
            {!inventory || inventory.length === 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Nếu bạn đã mở hộp nhưng không thấy items, có thể do:
                </p>
                <ul className="text-sm text-gray-500 text-left max-w-md mx-auto">
                  <li>• Backend chưa khởi động</li>
                  <li>• API endpoint không đúng</li>
                  <li>• Token authentication có vấn đề</li>
                  <li>• Database chưa có dữ liệu</li>
                </ul>
                <Link
                  href="/mystery-box"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium mt-4"
                >
                  🎁 Mở hộp ngay
                </Link>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <p>Đang hiển thị 0 / {inventory.length} items sau khi lọc</p>
                <p>Thử xóa bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedInventory.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Item Header */}
                <div className="relative p-4 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{getTypeIcon(item.chessPiece.type)}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleFavorite(item._id)}
                        className={`p-2 rounded-full transition-colors ${
                          item.isFavorite 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={item.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                      >
                        {item.isFavorite ? '❤️' : '🤍'}
                      </button>
                      <button
                        onClick={() => toggleEquip(item._id)}
                        className={`p-2 rounded-full transition-colors ${
                          item.isEquipped 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={item.isEquipped ? 'Bỏ trang bị' : 'Trang bị'}
                      >
                        {item.isEquipped ? '⚔️' : '🛡️'}
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 text-lg">{item.chessPiece.name}</h3>
                    <div className="flex justify-center space-x-2 mt-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(item.chessPiece.rarity)}`}>
                        {getRarityText(item.chessPiece.rarity)}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.chessPiece.type)}`}>
                        {item.chessPiece.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Từ banner: <span className="font-medium text-purple-600">{item.banner.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Nhận ngày: {new Date(item.obtainedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>


                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    {item.isEquipped && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                        ⚔️ Đang trang bị
                      </span>
                    )}
                    {item.isFavorite && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                        ❤️ Yêu thích
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                      {item.condition === 'new' ? '🆕 Mới' : 
                       item.condition === 'good' ? '✅ Tốt' : 
                       item.condition === 'worn' ? '⚠️ Cũ' : '❌ Hỏng'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quân cờ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Banner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày nhận
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedInventory.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                              {getTypeIcon(item.chessPiece.type)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.chessPiece.name}</div>
                            <div className="flex space-x-2 mt-1">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(item.chessPiece.rarity)}`}>
                                {getRarityText(item.chessPiece.rarity)}
                              </span>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.chessPiece.type)}`}>
                                {item.chessPiece.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.banner.name}</div>
                        <div className="text-sm text-gray-500">{item.banner.theme}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(item.obtainedAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {item.isEquipped && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ⚔️
                            </span>
                          )}
                          {item.isFavorite && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              ❤️
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleFavorite(item._id)}
                            className={`p-2 rounded-full transition-colors ${
                              item.isFavorite 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title={item.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                          >
                            {item.isFavorite ? '❤️' : '🤍'}
                          </button>
                          <button
                            onClick={() => toggleEquip(item._id)}
                            className={`p-2 rounded-full transition-colors ${
                              item.isEquipped 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title={item.isEquipped ? 'Bỏ trang bị' : 'Trang bị'}
                          >
                            {item.isEquipped ? '⚔️' : '🛡️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
