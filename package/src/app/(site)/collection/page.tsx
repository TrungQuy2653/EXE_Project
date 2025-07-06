import Breadcrumb from '@/app/components/Common/Breadcrumb'
import ProductList from '@/app/components/Shop/Product'
import CollectionSlider from '@/app/components/Shop/CollectionSlider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kỳ Vương Sưu Tầm',
}

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='Bộ Sưu Tập' />

      <ProductList />
      <CollectionSlider />


    </>
  )
}
