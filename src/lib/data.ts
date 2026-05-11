import { Mango, Order } from "@/lib/type";


// export const mangoes: Mango[] = [
//   {
//     id: '1',
//     name: 'Himsagar',
//     nameBn: 'হিমসাগর',
//     price: 120,
//     unit: 'কেজি',
//     image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
//     descriptionBn: 'রাজশাহীর সেরা হিমসাগর আম। সুস্বাদু এবং সুগন্ধি।',
//     category: 'Premium',
//     isPopular: true
//   },
//   {
//     id: '2',
//     name: 'Langra',
//     nameBn: 'ল্যাংড়া',
//     price: 100,
//     unit: 'কেজি',
//     image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&h=400&auto=format&fit=crop',
//     descriptionBn: 'অসাধারণ স্বাদ এবং পাতলা আঁশযুক্ত ল্যাংড়া আম।',
//     category: 'Popular',
//     isPopular: true
//   },
//   {
//     id: '3',
//     name: 'Amrapali',
//     nameBn: 'আম্রপালি',
//     price: 150,
//     unit: 'কেজি',
//     image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&h=400&auto=format&fit=crop',
//     descriptionBn: 'ছোট কিন্তু মিষ্টির রাজা আম্রপালি আম।',
//     category: 'Sweetest',
//     isPopular: true
//   },
//   {
//     id: '4',
//     name: 'Fazli',
//     nameBn: 'ফজলি',
//     price: 80,
//     unit: 'কেজি',
//     image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&h=400&auto=format&fit=crop',
//     descriptionBn: 'আকারে বড় এবং মাংসল ফজলি আম। আচার বানাতে সেরা।',
//     category: 'Budget'
//   },
//   {
//     id: '5',
//     name: 'Gopalbhog',
//     nameBn: 'গোপালভোগ',
//     price: 130,
//     unit: 'কেজি',
//     image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
//     descriptionBn: 'সুবাসিত এবং রসালো গোপালভোগ আম।',
//     category: 'Premium'
//   },
//   {
//     id: '6',
//     name: 'Khitshapati',
//     nameBn: 'ক্ষীরশাপাতি',
//     price: 140,
//     unit: 'কেজি',
//     image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&h=400&auto=format&fit=crop',
//     descriptionBn: 'চাঁপাইনবাবগঞ্জের বিখ্যাত ক্ষীরশাপাতি আম।',
//     category: 'Premium',
//     isPopular: true
//   }
// ];

export const mangoes: Mango[] = [
  {
    id: '1',
    name: 'Himsagar',
    nameBn: 'হিমসাগর',
    price: 120,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'রাজশাহীর সেরা হিমসাগর আম। সুস্বাদু এবং সুগন্ধি।',
    category: 'Premium',
    isPopular: true
  },
  {
    id: '2',
    name: 'Langra',
    nameBn: 'ল্যাংড়া',
    price: 100,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'অসাধারণ স্বাদ এবং পাতলা আঁশযুক্ত ল্যাংড়া আম।',
    category: 'Popular',
    isPopular: true
  },
  {
    id: '3',
    name: 'Amrapali',
    nameBn: 'আম্রপালি',
    price: 150,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'ছোট কিন্তু মিষ্টির রাজা আম্রপালি আম।',
    category: 'Sweetest',
    isPopular: true
  },
  {
    id: '4',
    name: 'Fazli',
    nameBn: 'ফজলি',
    price: 80,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'আকারে বড় এবং মাংসল ফজলি আম। আচার বানাতে সেরা।',
    category: 'Budget'
  },
  {
    id: '5',
    name: 'Gopalbhog',
    nameBn: 'গোপালভোগ',
    price: 130,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'সুবাসিত এবং রসালো গোপালভোগ আম।',
    category: 'Premium'
  },
  {
    id: '6',
    name: 'Khirshapat',
    nameBn: 'ক্ষীরশাপাতি',
    price: 140,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'চাঁপাইনবাবগঞ্জের বিখ্যাত ক্ষীরশাপাতি আম।',
    category: 'Premium',
    isPopular: true
  },

  // -------------------- NEW 14 ITEMS --------------------

  {
    id: '7',
    name: 'Haribhanga',
    nameBn: 'হাড়িভাঙ্গা',
    price: 110,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'রংপুরের বিখ্যাত হাড়িভাঙ্গা আম। খুবই রসালো।',
    category: 'Popular',
    isPopular: true
  },
  {
    id: '8',
    name: 'Ashwina',
    nameBn: 'আশ্বিনা',
    price: 90,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'দেরিতে পাওয়া যায় এমন সুস্বাদু আশ্বিনা আম।',
    category: 'Seasonal'
  },
  {
    id: '9',
    name: 'Bombay Green',
    nameBn: 'বোম্বাই গ্রিন',
    price: 95,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'টক-মিষ্টি স্বাদের জনপ্রিয় সবুজ আম।',
    category: 'Popular'
  },
  {
    id: '10',
    name: 'Mohanbhog',
    nameBn: 'মোহনভোগ',
    price: 125,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'অত্যন্ত মিষ্টি ও সুগন্ধি মোহনভোগ আম।',
    category: 'Sweetest',
    isPopular: true
  },
  {
    id: '11',
    name: 'Banana Mango',
    nameBn: 'কলা আম',
    price: 105,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'লম্বাটে আকৃতির মিষ্টি স্বাদের কলা আম।',
    category: 'Unique'
  },
  {
    id: '12',
    name: 'Brindabani',
    nameBn: 'বৃন্দাবনী',
    price: 115,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'গন্ধে ভরপুর ও রসালো বৃন্দাবনী আম।',
    category: 'Premium'
  },
  {
    id: '13',
    name: 'Chok Anan',
    nameBn: 'চক আনন',
    price: 85,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'বিদেশি জাতের টক-মিষ্টি আম।',
    category: 'Imported'
  },
  {
    id: '14',
    name: 'Deori',
    nameBn: 'দেওড়ী',
    price: 100,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'দেশি জাতের জনপ্রিয় সুস্বাদু আম।',
    category: 'Popular'
  },
  {
    id: '15',
    name: 'Kalia',
    nameBn: 'কালিয়া',
    price: 98,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'গাঢ় রঙের মিষ্টি স্বাদের কালিয়া আম।',
    category: 'Budget'
  },
  {
    id: '16',
    name: 'Lakshmanbhog',
    nameBn: 'লক্ষ্মণভোগ',
    price: 135,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'অত্যন্ত রসালো ও সুগন্ধি লক্ষ্মণভোগ আম।',
    category: 'Premium',
    isPopular: true
  },
  {
    id: '17',
    name: 'Surma Fazli',
    nameBn: 'সুরমা ফজলি',
    price: 88,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'ফজলির উন্নত জাত, বড় আকারের আম।',
    category: 'Budget'
  },
  {
    id: '18',
    name: 'Guti',
    nameBn: 'গুটি আম',
    price: 70,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'ছোট আকারের কিন্তু মিষ্টি স্বাদের আম।',
    category: 'Budget'
  },
  {
    id: '19',
    name: 'Chausa',
    nameBn: 'চৌসা',
    price: 145,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'ভারতীয় জনপ্রিয় মিষ্টি আম চৌসা।',
    category: 'Premium',
    isPopular: true
  },
  {
    id: '20',
    name: 'Rajbhog',
    nameBn: 'রাজভোগ',
    price: 160,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
    descriptionBn: 'সবচেয়ে মিষ্টি এবং প্রিমিয়াম মানের রাজভোগ আম।',
    category: 'Premium',
    isPopular: true
  }
];
export const mockOrders: Order[] = [
    {
      id: 'MS-8241',
      date: 'মে ১১, ২০২৬',
      total: 840,
      status: 'pending',
      items: [mangoes[0], mangoes[1], mangoes[2]],
    },
    {
      id: 'MS-7129',
      date: 'মে ০৮, ২০২৬',
      total: 1250,
      status: 'processing',
      items: [mangoes[5], mangoes[4]],
    },
    {
      id: 'MS-6092',
      date: 'মে ০৫, ২০২৬',
      total: 450,
      status: 'delivered',
      items: [mangoes[3]],
    }
  ];