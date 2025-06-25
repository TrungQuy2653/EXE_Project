import { NextResponse } from 'next/server'

import { HeaderItem } from '@/app/types/menu'
import { FeaturesType } from '@/app/types/features'
import { ExpertChiefType } from '@/app/types/expertchief'
import { GalleryImagesType } from '@/app/types/galleryimage'
import { FooterLinkType } from '@/app/types/footerlink'
import { FullMenuType } from '@/app/types/fullmenu'

const HeaderData: HeaderItem[] = [
  { label: 'Sản Phẩm', href: '/#product' },
  { label: 'Docs', href: '/documentation' },
  { label: 'Mở Ngay', href: '/#mystery' },

]

const FeaturesData: FeaturesType[] = [
  {
    imgSrc: '/images/Features/feature1.svg',
    heading: 'Không Đơn Thuần Là Một Mô Hình',
    subheading:
      'Mỗi sản phẩm là một tác phẩm nghệ thuật được đầu tư công phu, kết hợp giữa mỹ học hiện đại và giá trị truyền thống.',
  },
  {
    imgSrc: '/images/Features/feature2.svg',
    heading: 'Mỗi Quân Cờ Là Một Câu Chuyện',
    subheading:
      'Từng mô hình là sự kết tinh của những truyền thuyết lịch sử và văn hóa Việt, được tái hiện sinh động qua thiết kế sáng tạo.',
  },
  {
    imgSrc: '/images/Features/feature3.svg',
    heading: 'Tôn Vinh Bản Sắc Văn Hóa Việt',
    subheading:
      'Dự án hướng đến việc bảo tồn và lan toả giá trị văn hóa dân tộc thông qua từng chi tiết thiết kế đặc sắc và ý nghĩa.',
  },
  {
    imgSrc: '/images/Features/feature4.svg',
    heading: 'Trải Nghiệm Sưu Tầm Mới Lạ',
    subheading:
      'Sưu tầm không còn chỉ là sở hữu – đó là hành trình khám phá văn hóa và cảm hứng nghệ thuật trong từng quân cờ.',
  },
  {
    imgSrc: '/images/Features/feature5.svg',
    heading: 'Kết Nối Cộng Đồng Qua Sưu Tầm',
    subheading:
      'Mỗi người sưu tầm là một mảnh ghép trong hành trình gìn giữ và chia sẻ văn hóa – cùng nhau tạo nên một cộng đồng đam mê và gắn kết.',
  },
]

const ExpertChiefData: ExpertChiefType[] = [
  {
    profession: 'Senior Chef',
    name: 'Marco Benton',
    imgSrc: '/models/demo.glb',
  },
  {
    profession: 'Junior Chef',
    name: 'Elena Rivera',
    imgSrc: '/models/demo.glb',
  },
  {
    profession: 'Junior Chef',
    name: 'John Doe',
    imgSrc: '/models/demo.glb',
  },
]

const GalleryImagesData: GalleryImagesType[] = [
  {
    src: '/images/Gallery/ai1.webp',
    name: 'Hào Khí Lạc Việt',
    price: 350,
  },
  {
    src: '/images/Gallery/ai2.webp',
    name: 'Coming Soon',
    price: 17,
  },
]

const FullMenuData: FullMenuType[] = [
  {
    name: 'Grilled Salmon',
    price: '$18.99',
    description: 'Served with lemon butter sauce and grilled vegetables.',
  },
  {
    name: 'Caesar Salad',
    price: '$9.99',
    description: 'Crisp romaine with parmesan, croutons, and Caesar dressing.',
  },
  {
    name: 'Margherita Pizza',
    price: '$13.49',
    description: 'Classic pizza with tomato, mozzarella, and fresh basil.',
  },
  {
    name: 'Tomato Basil Soup',
    price: '$6.99',
    description: 'Creamy tomato soup with a hint of garlic and fresh basil.',
  },
  {
    name: 'Chocolate Lava Cake',
    price: '$7.99',
    description:
      'Warm chocolate cake with a molten center served with vanilla ice cream.',
  },
  {
    name: 'Spaghetti Carbonara',
    price: '$15.25',
    description:
      'Spaghetti tossed with eggs, pancetta, parmesan, and black pepper.',
  },
  {
    name: 'Tiramisu',
    price: '$8.50',
    description:
      'Layered espresso-soaked ladyfingers with mascarpone and cocoa.',
  },
]

const FooterLinkData: FooterLinkType[] = [
  {
    section: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/#aboutus' },
      { label: 'Menu', href: '/#menu' },
      { label: 'Reserve Table', href: '/#reserve' },
    ],
  },
  {
    section: 'Support',
    links: [
      { label: 'Help/FAQ', href: '/' },
      { label: 'Press', href: '/' },
      { label: 'Affiliates', href: '/' },
      { label: 'Hotel owners', href: '/' },
      { label: 'Partners', href: '/' },
    ],
  },
]

export const GET = () => {
  return NextResponse.json({
    HeaderData,
    FeaturesData,
    ExpertChiefData,
    GalleryImagesData,
    FullMenuData,
    FooterLinkData,
  })
}
