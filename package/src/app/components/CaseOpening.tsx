'use client'
import { useRef, useState } from 'react'

export default function CaseOpening() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const skins = [
    { name: 'AK-47 | Redline', color: '#8847ff' },
    { name: 'M4A1-S | Hyper Beast', color: '#eb4b4b' },
    { name: 'AWP | Asiimov', color: '#eb4b4b' },
    { name: 'P250 | Supernova', color: '#5e98d9' },
    { name: 'UMP-45 | Labyrinth', color: '#b0c3d9' },
    { name: '★ Karambit | Fade', color: '#ffd700' },
  ]

  const ITEM_WIDTH = 120
  const SPIN_DURATION = 10_000 // 10 giây

  const startOpening = () => {
    if (!containerRef.current) return

    setSpinning(true)
    setResult(null)

    const container = containerRef.current
    const containerWidth = container.offsetWidth

    // Scroll từ phải sang trái, nên tạo danh sách dài
    const fullSkins = [...skins, ...skins, ...skins, ...skins, ...skins]
    const totalWidth = fullSkins.length * ITEM_WIDTH

    // Random vị trí dừng sao cho phần tử đúng giữa màn hình
    const stopIndex = Math.floor(Math.random() * skins.length) + skins.length * 2
    const targetOffset = stopIndex * ITEM_WIDTH - containerWidth / 2 + ITEM_WIDTH / 2

    const start = performance.now()
    const animate = (time: number) => {
      const elapsed = time - start
      const progress = Math.min(elapsed / SPIN_DURATION, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      container.scrollLeft = targetOffset * easeOut

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        const resultIndex = Math.floor((container.scrollLeft + containerWidth / 2) / ITEM_WIDTH)
        const finalSkin = fullSkins[resultIndex]
        setResult(finalSkin.name)
        setSpinning(false)
      }
    }

    requestAnimationFrame(animate)
  }

  return (
    <div className="text-center space-y-4">
      <h2 className="text-xl font-bold">🔓 Mở Hòm CS2</h2>

      <div className="relative w-[480px] h-[120px] mx-auto">
        {/* Mũi tên giữa */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20 text-red-500 text-2xl">
          ▲
        </div>

        {/* Container scroll */}
        <div
          ref={containerRef}
          className="relative w-full h-full overflow-hidden border border-gray-300 bg-black rounded"
        >
          <div className="flex flex-row-reverse" style={{ width: skins.length * 120 * 5 }}>
            {[...skins, ...skins, ...skins, ...skins, ...skins].map((skin, i) => (
              <div
                key={i}
                className="w-[120px] h-[120px] flex items-center justify-center text-xs text-white font-semibold border"
                style={{ backgroundColor: skin.color }}
              >
                {skin.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={startOpening}
        disabled={spinning}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {spinning ? 'Đang mở trong 10s...' : 'Mở hòm'}
      </button>

      {result && (
        <p className="mt-4 font-medium text-lg text-green-600">
          🎉 Bạn nhận được: {result}
        </p>
      )}
    </div>
  )
}
