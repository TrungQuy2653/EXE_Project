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

  const ITEM_WIDTH = 300
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
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      container.scrollLeft = targetOffset * easeOutExpo


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
    <section id='mystery' className='relative overflow-hidden md:py-20'>
      <div className='container'>
        <div className='text-center mb-14'>
          <p className='text-primary text-lg font-normal tracking-widest uppercase'>
            Roll Roll Roll Roll ra Roi
          </p>
          <h2 className='font-semibold lg:max-w-60% mx-auto mt-3'>
            Mở hòm nào!!!!!!!!!!!!!!
          </h2>
        </div>



        <div className="relative w-[1200px] h-[300px] mx-auto">
          {/* Container scroll */}
          <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden border border-gray-300 bg-black rounded"
          >
            <div className="flex flex-row-reverse" style={{ width: skins.length * 300 * 5 }}>
              {[...skins, ...skins, ...skins, ...skins, ...skins].map((skin, i) => (
                <div
                  key={i}
                  className="w-[300px] h-[300px] flex items-center justify-center text-xs text-white font-semibold border"
                  style={{ backgroundColor: skin.color }}
                >
                  {skin.name}
                </div>
              ))}
            </div>
          </div>
          {/* Mũi tên giữa */}
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-20 text-red-500 text-2xl">
            ▲
          </div>
        </div>



        <div className="flex flex-col justify-center items-center">

          <button
            onClick={startOpening}
            disabled={spinning}
            className='mt-10 px-6 py-2 border border-primary rounded-full text-base font-medium text-white bg-primary hover:bg-primary/20 hover:text-primary hover:cursor-pointer transition ease-in-out duration-300'
          >
            {spinning ? 'Quay...Quay...Quay....' : 'Mở hòm'}
          </button>


          {result && (
            <p className="mt-4 font-medium text-lg text-green-600">
              🎉 Bạn nhận được: {result}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
