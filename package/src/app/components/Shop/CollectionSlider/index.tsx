'use client'
import Slider from 'react-slick'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ChiefDetailSkeleton from '../../Skeleton/ChiefDetail'
import { CollectionType } from '@/app/types/collection'

const Colection = () => {
  const [Collection, setColleciton] = useState<CollectionType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setColleciton(data.CollectionData)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    cssEase: 'linear',
    // responsive: [
    //   {
    //     breakpoint: 1200,
    //     settings: {
    //       slidesToShow: 3,
    //     },
    //   },
    //   {
    //     breakpoint: 800,
    //     settings: {
    //       slidesToShow: 2,
    //     },
    //   },
    //   {
    //     breakpoint: 450,
    //     settings: {
    //       slidesToShow: 1,
    //     },
    //   },
    // ],
  }

  return (
    <section>
      <div className='container mx-auto my-10'>
        <Slider {...settings}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
              <ChiefDetailSkeleton key={i} />
            ))
            : Collection.map((items, i) => (
              <div key={i}>
                <div className='m-3 my-10 p-10 text-center backdrop-blur-md bg-white/50 rounded-3xl'>
                  <div className='relative'>
                    <Image
                      src={items.imgSrc}
                      alt='gaby'
                      width={362}
                      height={262}
                      className='inline-block m-auto w-auto'
                    />
                   
                  </div>
                  <div className='mt-16'>
                    <h3 className='text-2xl font-semibold text-black'>
                      {items.name}
                    </h3>
                    <h4 className='text-lg font-normal text-black/50 opacity-50'>
                      {items.price.toLocaleString('vi-VN')}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </section >
  )
}

export default Colection