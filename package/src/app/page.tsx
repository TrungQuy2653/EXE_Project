import React from 'react'
import Hero from '@/app/components/Home/Hero'
import Features from '@/app/components/Home/Features'
import AboutUs from '@/app/components/Home/AboutUs'
import Product from '@/app/components/Home/Product'
import Collection from '@/app/components/Home/Collection'
import Newsletter from '@/app/components/Home/Newsletter'
import Mystery from '@/app/components/Home/Mystery'
import { Metadata } from 'next'
import ContactForm from './components/Contact/Form'
export const metadata: Metadata = {
  title: 'Kỳ Vương Sưu Tầm',
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Collection />
      <Product />
      <AboutUs />
      <Mystery />
      {/* <ContactForm /> */}
      <Newsletter />
    </main>
  )
}
