import SignUp from '@/app/components/Auth/SignUp'
import Breadcrumb from '@/app/components/Common/Breadcrumb'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign Up | Property',
}

const SignupPage = () => {
  return (
    <>
      <Breadcrumb pageName='Trang đăng ký' />

      <div className='container mt-2'>
        <div className='flex justify-center mb-4'></div>
        <SignUp />
        <div className="text-center mt-4 mb-10">
          <p className='text-body-secondary mb-4 text-black/60 text-base'>
            Khi tạo tài khoản, bạn đồng ý với{' '}
            <a href='/' className='text-primary hover:underline'>
              Chính sách bảo mật
            </a>{' '}
            và{' '}
            <a href='/' className='text-primary hover:underline'>
              Điều khoản sử dụng
            </a>.
          </p>

          <p className='text-body-secondary text-black/60 text-base'>
            Bạn đã có tài khoản?
            <Link href='/signin' className='pl-2 text-primary hover:underline'>
              Đăng Nhập
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default SignupPage
