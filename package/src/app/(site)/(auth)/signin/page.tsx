import Signin from '@/app/components/Auth/SignIn'
import Breadcrumb from '@/app/components/Common/Breadcrumb'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In | Property',
}

const SigninPage = () => {
  return (
    <>
      <Breadcrumb pageName='Sign In Page' />
      <div className='container mt-2'>
        <div className='flex justify-center mb-4'></div>
        <Signin />
        <div className="text-center mt-4 mb-10">
          <Link
            href='/ForgotPassword'
            className='mb-2 inline-block text-base text-black hover:text-primary  hover:underline'>
            Quên mật khẩu?
          </Link>
          <p className='text-black text-base'>
            Bạn chưa có tài khoản?{' '}
            <Link
              href='/signup'
              className='text-primary hover:underline'>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default SigninPage
