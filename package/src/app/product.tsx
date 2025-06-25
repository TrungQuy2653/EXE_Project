import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Kỳ Vương Sưu Tầm',
}

export default function Product() {
  return (
    <main>
      <h1 className='text-3xl font-bold'>Sản phẩm</h1>
      <p className='mt-4'>Đây là trang sản phẩm của Kỳ Vương Sưu Tầm.</p>
      <p className='mt-2'>Chúng tôi cung cấp các sản phẩm độc đáo và chất lượng cao.</p>
      <p className='mt-2'>Hãy khám phá bộ sưu tập của chúng tôi ngay hôm nay!</p>
    </main>
  )
}