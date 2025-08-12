import { Merienda  } from 'next/font/google'
import './globals.css'
import Header from '@/app/components/Layout/Header'
import Footer from '@/app/components/Layout/Footer'
import ScrollToTop from '@/app/components/ScrollToTop'
import { AuthProvider } from '@/contexts/AuthContext'
const font = Merienda ({
  subsets: ['vietnamese'],
  weight: ['400'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${font.className}`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  )
}
