'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'
import MobileHeaderLink from './Navigation/MobileHeaderLink'
import SignIn from '@/app/components/Auth/SignIn'
import SignUp from '@/app/components/Auth/SignUp'
import { Icon } from '@iconify/react/dist/iconify.js'
import { HeaderItem } from '@/app/types/menu'

const Header: React.FC = () => {
  const [headerLink, setHeaderLink] = useState<HeaderItem[]>([])
  const router = useRouter()

  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)

  const navbarRef = useRef<HTMLDivElement>(null)
  const signInRef = useRef<HTMLDivElement>(null)
  const signUpRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setHeaderLink(data.HeaderData)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchData()
  }, [])

  const handleScroll = () => {
    setSticky(window.scrollY >= 20)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false)
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target as Node)
    ) {
      setIsSignUpOpen(false)
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen, isSignInOpen, isSignUpOpen])

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen])

  return (
    <header
      className={`fixed top-0 z-40 py-4 w-full transition-all duration-300 ${sticky ? 'shadow-lg bg-white' : 'shadow-none'
        }`}>
      <div>
        <div className='container flex items-center justify-between'>
          <div>
            <Logo />
          </div>
          <nav className='hidden lg:flex grow items-center gap-4 xl:gap-6 justify-center'>
            {headerLink.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>
          <div className='flex items-center gap-2 lg:gap-3'>
            <Link
              href='#'
              className='text-lg font-medium hover:text-primary hidden xl:block'>
              <Icon
                icon='solar:phone-bold'
                className='text-primary text-3xl lg:text-2xl inline-block me-2'
              />
              (+84) 989999999
            </Link>
            <div
              onClick={() => setIsSignInOpen(true)}
              className="relative w-[225px] h-[75px] cursor-pointer hover:opacity-80 transition hidden lg:block"
            >
              <Image
                src="/images/Button/primary.png"
                alt="Đăng Nhập"
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
              <span className="absolute inset-0 flex items-center justify-center text-text text-xl font-semibold">
                Đăng Nhập
              </span>
            </div>
            {isSignInOpen && (
              <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
                <div
                  ref={signInRef}
                  className='relative mx-auto w-full max-w-md overflow-hidden rounded-lg px-8 pt-14 pb-8 text-center bg-white'>
                  <button
                    onClick={() => setIsSignInOpen(false)}
                    className='absolute top-0 right-0 mr-4 mt-8 hover:cursor-pointer'
                    aria-label='Close Sign In Modal'>
                    <Icon
                      icon='material-symbols:close-rounded'
                      width={24}
                      height={24}
                      className='text-black hover:text-primary text-24 inline-block me-2'
                    />
                  </button>
                  <div>
                    <Logo />
                  </div>
                  <SignIn />

                  <span
                    onClick={() => {
                      setIsSignInOpen(false)
                      router.push('/forgotpassword')
                    }}
                    className='mb-2 inline-block text-base text-black hover:text-primary hover:underline cursor-pointer'
                  >
                    Quên mật khẩu?
                  </span>
                  <p className="text-black text-base">
                    Bạn chưa có tài khoản?{' '}
                    <span
                      onClick={() => {
                        setIsSignInOpen(false)
                        setIsSignUpOpen(true)
                      }}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      Đăng ký ngay
                    </span>
                  </p>
                </div>
              </div>
            )}
            <div
              onClick={() => setIsSignUpOpen(true)}
              className="relative w-[225px] h-[75px] cursor-pointer hover:opacity-80 transition hidden lg:block"
            >
              <Image
                src="/images/Button/primary.png" // <-- đổi thành ảnh nút Đăng Ký nếu có
                alt="Đăng Ký"
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
              <span className="absolute inset-0 flex items-center justify-center text-text text-xl font-semibold">
                Đăng Ký
              </span>
            </div>
            {isSignUpOpen && (
              <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
                <div
                  ref={signUpRef}
                  className='relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-dark_grey/90 bg-white backdrop-blur-md px-8 pt-14 pb-8 text-center'>
                  <button
                    onClick={() => setIsSignUpOpen(false)}
                    className='absolute top-0 right-0 mr-4 mt-8 hover:cursor-pointer'
                    aria-label='Close Sign Up Modal'>
                    <Icon
                      icon='material-symbols:close-rounded'
                      width={24}
                      height={24}
                      className='text-black hover:text-primary text-24 inline-block me-2'
                    />
                  </button>
                  <div>
                    <Logo />
                  </div>
                  <SignUp />
                  <p className='text-body-secondary mb-4 text-black/60 text-base'>
                    Khi tạo tài khoản, bạn đồng ý với{' '}
                    <a href='/' className='hover:underline'>
                      Chính sách bảo mật
                    </a>{' '}
                    và{' '}
                    <a href='/' className='hover:underline'>
                      Điều khoản sử dụng
                    </a>.
                  </p>

                  <p className="text-black text-base">
                    Bạn đã có tài khoản?{' '}
                    <span
                      onClick={() => {
                        setIsSignInOpen(true)
                        setIsSignUpOpen(false)
                      }}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      Đăng nhập
                    </span>
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className='block lg:hidden p-2 rounded-lg'
              aria-label='Toggle mobile menu'>
              <span className='block w-6 h-0.5 bg-black'></span>
              <span className='block w-6 h-0.5 bg-black mt-1.5'></span>
              <span className='block w-6 h-0.5 bg-black mt-1.5'></span>
            </button>
          </div>
        </div>
        {navbarOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
        )}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 max-w-xs ${navbarOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50`}>
          <div className='flex items-center justify-between gap-2 p-4'>
            <div>
              <Logo />
            </div>
            {/*  */}
            <button
              onClick={() => setNavbarOpen(false)}
              className="hover:cursor-pointer"
              aria-label='Close menu Modal'>
              <Icon
                icon='material-symbols:close-rounded'
                width={24}
                height={24}
                className='text-black hover:text-primary text-24 inline-block me-2'
              />
            </button>
          </div>
          <Link
            href='#'
            className='text-lg font-medium hover:text-primary block md:hidden mt-6 p-4'>
            <Icon
              icon='solar:phone-bold'
              className='text-primary text-3xl lg:text-2xl inline-block me-2'
            />
            (+84) 989999999
          </Link>
          <nav className='flex flex-col items-start p-4'>
            {headerLink.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}
            <div className='mt-4 flex flex-col space-y-4 w-full'>
              <button
                className='bg-primary text-white px-4 py-2 rounded-lg border  border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'
                onClick={() => {
                  setIsSignInOpen(true)
                  setNavbarOpen(false)
                }}>
                Đang Nhập
              </button>
              <button
                className='bg-primary text-white px-4 py-2 rounded-lg border  border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'
                onClick={() => {
                  setIsSignUpOpen(true)
                  setNavbarOpen(false)
                }}>
                Đăng Ký
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header >
  )
}

export default Header
