import Image from 'next/image'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href='/' className='flex items-center gap-0'>
      <Image
        src='/images/Logo/Logo.svg'
        alt='logo'
        width={34}
        height={34}
        className='h-34 w-auto'
        quality={100}
      />
      <p className='text-black text-2xl font-semibold leading-tight'>
        Kỳ Vương<br />Sưu Tầm
      </p>   </Link>
  )
}

export default Logo
