import ForgotPassword from '@/app/components/Auth/ForgotPassword'
import Breadcrumb from '@/app/components/Common/Breadcrumb'

import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Featurs | Crypgo',
}

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='Quên mật khẩu' />

      <div className='container mt-2'>
        <div className='flex justify-center mb-4'><ForgotPassword /></div>

      </div>

    </>
  )
}
