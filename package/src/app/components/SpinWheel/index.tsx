'use client'

import SpinWheel from './wheel'

type SpinPopupProps = {
  onClose: () => void
}

const SpinPopup = ({ onClose }: SpinPopupProps) => {
  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center relative'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold'
        >
          ×
        </button>
        <h2 className='text-2xl font-semibold mb-4'>Vòng quay may mắn 🎉</h2>
        <SpinWheel />
      </div>
    </div>
  )
}

export default SpinPopup
