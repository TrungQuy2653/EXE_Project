
'use client'

import { useState } from 'react'
import SpinPopup from '@/app/components/SpinWheel'
import Link from 'next/link'
import Image from 'next/image'

const Hero = () => {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <section id='home-section' className='bg-gray-50 relative'>
      <div className='container xl:pt-7 pt-16'>
        <div className='grid grid-cols-1 lg:grid-cols-12 items-center'>
          <div className='lg:col-span-6'>
            <h1 className='font-semibold mb-5 text-black lg:text-start text-center sm:leading-20 leading-16'>
              Unbox the mystery, collect the culture.
            </h1>
            <p className='text-black/55 text-lg font-normal mb-10 lg:text-start text-center'>
              Explore a world of blind box collectibles inspired by Vietnamese stories, legends, and traditions.
            </p>
            <div className='flex flex-col sm:flex-row gap-5 items-center justify-center lg:justify-start'>
              <Link href='/#menu'>
                <button className='text-xl font-medium rounded-full text-white py-3 px-8 bg-primary hover:text-primary border border-primary hover:bg-transparent hover:cursor-pointer transition ease-in-out duration-300'>
                  Our Product
                </button>
              </Link>
              <button
                onClick={() => setShowPopup(true)}
                className='text-xl border border-primary rounded-full font-medium py-3 px-8 text-primary hover:text-white hover:bg-primary hover:cursor-pointer transition ease-in-out duration-300'
              >
                Open Mystery
              </button>
            </div>
          </div>

          <div className='lg:col-span-6 flex justify-center relative'>
            <div className='flex bg-white p-2 gap-5 items-center bottom-10 left-10 rounded-xl absolute'>
              <Image
                src='/images/hero/chess.webp'
                alt='chess-image'
                width={68}
                height={68}
              />
              <p className='text-lg font-normal'>
                More than Chess <br /> It's a Culture
              </p>
            </div>
            <Image
              src='/images/hero/banner.webp'
              alt='banner'
              width={1000}
              height={805}
            />
          </div>
        </div>
      </div>

      {showPopup && <SpinPopup onClose={() => setShowPopup(false)} />}
    </section>
  )
}

export default Hero


// 'use client'
// import Image from 'next/image'
// import Link from 'next/link'

// const Hero = () => {
//   return (
//     <section id='home-section' className='bg-gray-50'>
//       <div className='container xl:pt-7 pt-16'>
//         <div className='grid grid-cols-1 lg:grid-cols-12 items-center'>
//           <div className='lg:col-span-6'>
//             <h1 className='font-semibold mb-5 text-black lg:text-start text-center sm:leading-20 leading-16'>
//               Unbox the mystery, collect the culture.
//             </h1>
//             <p className='text-black/55 text-lg font-normal mb-10 lg:text-start text-center'>
//               Explore a world of blind box collectibles inspired by Vietnamese stories, legends, and traditions.
//             </p>
//             <div className='flex flex-col sm:flex-row gap-5 items-center justify-center lg:justify-start'>
//               <Link href='/#menu'>
//                 <button className='text-xl font-medium rounded-full text-white py-3 px-8 bg-primary hover:text-primary border border-primary hover:bg-transparent hover:cursor-pointer transition ease-in-out duration-300'>
//                   Our Product
//                 </button>
//               </Link>
//               <Link href='/#reserve'>
//                 <button className='text-xl border border-primary rounded-full font-medium py-3 px-8 text-primary hover:text-white hover:bg-primary hover:cursor-pointer transition ease-in-out duration-300'>
//                   Open Mystery
//                 </button>
//               </Link>
//             </div>
//           </div>
//           <div className='lg:col-span-6 flex justify-center relative'>
//             <div className='flex bg-white p-2 gap-5 items-center bottom-10 left-10 rounded-xl absolute'>
//               <Image
//                 src={'/images/hero/chess.webp'}
//                 alt='chess-image'
//                 width={68}
//                 height={68}
//               />
//               <p className='text-lg font-normal'>
//                 More than Chess <br /> It's a Culture
//               </p>
//             </div>
//             <Image
//               src='/images/hero/banner.webp'
//               alt='nothing'
//               width={1000}
//               height={805}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Hero


