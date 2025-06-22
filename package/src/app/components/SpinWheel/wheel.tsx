'use client'

import { useState } from 'react'
import { Wheel } from 'react-custom-roulette'

const data = [
  { option: 'Mai 09h' },
  { option: 'Mai 10hz' },
  { option: 'Mai 11h' },
  { option: 'Mai 12h' },
  { option: 'Mai 13h' },
  { option: 'Mai 14h' },
]

const SpinWheel = () => {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const [result, setResult] = useState<string | null>(null)

  const handleSpin = () => {
    const random = Math.floor(Math.random() * data.length)
    setPrizeNumber(random)
    setMustSpin(true)
    setResult(null)
  }

  return (
    <div className='flex flex-col items-center'>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={['#FF7F50', '#FFD700']}
        textColors={['#000']}
        onStopSpinning={() => {
          setMustSpin(false)
          setResult(data[prizeNumber].option)
        }}
      />
      <button
        onClick={handleSpin}
        className='mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700'
      >
        Quay
      </button>
      {result && (
        <p className='mt-3 text-lg font-semibold text-green-700'>
          Bạn trúng: {result}
        </p>
      )}
    </div>
  )
}

export default SpinWheel
