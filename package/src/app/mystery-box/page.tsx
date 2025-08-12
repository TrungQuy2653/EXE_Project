'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'

export default function MysteryBoxPage() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const skins = [
    { name: 'AK-47 | Redline', color: '#8847ff', rarity: 'Legendary' },
    { name: 'M4A1-S | Hyper Beast', color: '#eb4b4b', rarity: 'Epic' },
    { name: 'AWP | Asiimov', color: '#eb4b4b', rarity: 'Epic' },
    { name: 'P250 | Supernova', color: '#5e98d9', rarity: 'Rare' },
    { name: 'UMP-45 | Labyrinth', color: '#b0c3d9', rarity: 'Common' },
    { name: '★ Karambit | Fade', color: '#ffd700', rarity: 'Mythical' },
    { name: 'Desert Eagle | Golden Koi', color: '#ff6b35', rarity: 'Epic' },
    { name: 'Glock-18 | Water Elemental', color: '#4ecdc4', rarity: 'Rare' },
  ]

  const ITEM_WIDTH = 300
  const SPIN_DURATION = 8000 // 8 giây

  const startOpening = () => {
    if (!containerRef.current) return

    setSpinning(true)
    setResult(null)
    setShowResult(false)

    const container = containerRef.current
    const containerWidth = container.offsetWidth

    // Scroll từ phải sang trái, tạo danh sách dài
    const fullSkins = [...skins, ...skins, ...skins, ...skins, ...skins]
    const totalWidth = fullSkins.length * ITEM_WIDTH

    // Random vị trí dừng sao cho phần tử đúng giữa màn hình
    const stopIndex = Math.floor(Math.random() * skins.length) + skins.length * 2
    const targetOffset = stopIndex * ITEM_WIDTH - containerWidth / 2 + ITEM_WIDTH / 2

    const start = performance.now()
    const animate = (time: number) => {
      const elapsed = time - start
      const progress = Math.min(elapsed / SPIN_DURATION, 1)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      container.scrollLeft = targetOffset * easeOutExpo

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        const resultIndex = Math.floor((container.scrollLeft + containerWidth / 2) / ITEM_WIDTH)
        const finalSkin = fullSkins[resultIndex]
        setResult(finalSkin.name)
        setSpinning(false)
        setShowResult(true)
      }
    }

    requestAnimationFrame(animate)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Mythical': return 'text-yellow-500'
      case 'Legendary': return 'text-purple-500'
      case 'Epic': return 'text-red-500'
      case 'Rare': return 'text-blue-500'
      case 'Common': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  const getSkinByName = (name: string) => {
    return skins.find(skin => skin.name === name)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Icon icon="material-symbols:arrow-back" className="text-2xl text-primary" />
              <span className="text-lg font-semibold text-gray-700">Quay lại trang chủ</span>
            </Link>
            <h1 className="text-2xl font-bold text-primary">🎁 Mystery Box</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Mở Hòm Bí Ẩn
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hãy thử vận may của bạn! Mỗi lần mở hòm sẽ cho bạn một phần thưởng ngẫu nhiên.
            Bạn có thể nhận được những vật phẩm hiếm và giá trị!
          </p>
        </div>

        {/* Mystery Box Container */}
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full h-[400px] mx-auto mb-8">
            {/* Container scroll */}
            <div
              ref={containerRef}
              className="relative w-full h-full overflow-hidden border-4 border-primary/30 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl"
            >
              <div className="flex flex-row-reverse" style={{ width: skins.length * ITEM_WIDTH * 5 }}>
                {[...skins, ...skins, ...skins, ...skins, ...skins].map((skin, i) => (
                  <div
                    key={i}
                    className="w-[300px] h-[400px] flex flex-col items-center justify-center text-white font-semibold border border-primary/20 relative group"
                    style={{ backgroundColor: skin.color }}
                  >
                    <div className="text-center p-4">
                      <div className="text-2xl mb-2">🎮</div>
                      <div className="text-lg font-bold mb-2">{skin.name}</div>
                      <div className={`text-sm ${getRarityColor(skin.rarity)} font-semibold`}>
                        {skin.rarity}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mũi tên chỉ thị */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-20">
              <div className="text-red-500 text-4xl animate-bounce">▼</div>
              <div className="text-red-500 text-sm font-bold text-center">Kết quả</div>
            </div>

            {/* Hiệu ứng ánh sáng */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-60 animate-pulse"></div>
            </div>
          </div>

          {/* Nút mở hòm */}
          <div className="text-center">
            <button
              onClick={startOpening}
              disabled={spinning}
              className={`px-12 py-4 text-xl font-bold rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${
                spinning
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-primary text-white border-primary hover:bg-primary/90 hover:shadow-lg'
              }`}
            >
              {spinning ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Đang quay...</span>
                </div>
              ) : (
                '🎯 MỞ HÒM NGAY!'
              )}
            </button>
          </div>

          {/* Hiển thị kết quả */}
          {showResult && result && (
            <div className="mt-12 text-center">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border-2 border-primary/20">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Chúc mừng!</h3>
                <p className="text-lg text-gray-600 mb-4">Bạn đã nhận được:</p>
                
                {(() => {
                  const skin = getSkinByName(result)
                  return (
                    <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl p-6 border border-primary/30">
                      <div className="text-3xl mb-2">🎮</div>
                      <div className="text-xl font-bold text-gray-800 mb-2">{result}</div>
                      <div className={`text-lg font-semibold ${getRarityColor(skin?.rarity || '')}`}>
                        {skin?.rarity}
                      </div>
                    </div>
                  )
                })()}

                <button
                  onClick={() => {
                    setShowResult(false)
                    setResult(null)
                  }}
                  className="mt-6 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
                >
                  Mở hòm tiếp theo
                </button>
              </div>
            </div>
          )}

          {/* Danh sách phần thưởng có thể nhận */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Các phần thưởng có thể nhận
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skins.map((skin, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div
                    className="w-full h-32 rounded-lg mb-3 flex items-center justify-center text-white font-bold text-center"
                    style={{ backgroundColor: skin.color }}
                  >
                    <div className="text-4xl">🎮</div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">{skin.name}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${getRarityColor(skin.rarity)} bg-opacity-10`}>
                    {skin.rarity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
