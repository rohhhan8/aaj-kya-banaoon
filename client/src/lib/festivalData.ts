import { format, isWithinInterval, parse } from 'date-fns';

// Create interfaces to type our festival data
export interface Festival {
  id: string;
  name: string;
  description: string;
  date2023?: string; // Using 2023 as reference year
  date2024?: string; // YYYY-MM-DD format
  date2025?: string;
  isMovable: boolean; // Some festivals like Diwali change dates yearly based on lunar calendar
  region?: 'North' | 'South' | 'East' | 'West' | 'Central' | 'All India';
  dishes: string[]; // Traditionally associated dishes
  significance: string;
  imageUrl: string;
}

// Helper to determine if a date is between two dates (inclusive)
const isDateInRange = (startDate: string, endDate: string): boolean => {
  const today = new Date();
  let start, end;
  
  try {
    start = parse(startDate, 'yyyy-MM-dd', new Date());
    end = parse(endDate, 'yyyy-MM-dd', new Date());
    return isWithinInterval(today, { start, end });
  } catch (error) {
    console.error('Error parsing dates:', error);
    return false;
  }
};

// List of major Indian festivals
export const festivals: Festival[] = [
  {
    id: 'diwali',
    name: 'Diwali',
    description: 'Festival of Lights celebrating the victory of light over darkness',
    date2023: '2023-11-12',
    date2024: '2024-11-01',
    date2025: '2025-10-21',
    isMovable: true,
    region: 'All India',
    dishes: [
      'Gulab Jamun', 
      'Kaju Katli', 
      'Besan Ladoo', 
      'Aloo Tikki', 
      'Samosa', 
      'Chaat', 
      'Paneer Tikka'
    ],
    significance: 'Celebrates the return of Lord Rama after defeating Ravana',
    imageUrl: 'https://source.unsplash.com/random/300x200/?diwali,festival'
  },
  {
    id: 'holi',
    name: 'Holi',
    description: 'Festival of Colors celebrating the arrival of spring',
    date2023: '2023-03-08',
    date2024: '2024-03-25',
    date2025: '2025-03-14',
    isMovable: true,
    region: 'All India',
    dishes: [
      'Gujiya', 
      'Thandai', 
      'Bhang Lassi', 
      'Dahi Vada', 
      'Malpua', 
      'Puran Poli'
    ],
    significance: 'Celebrates the victory of good over evil and the arrival of spring',
    imageUrl: 'https://source.unsplash.com/random/300x200/?holi,colors'
  },
  {
    id: 'navratri',
    name: 'Navratri',
    description: 'Nine nights of celebrating Goddess Durga',
    date2023: '2023-10-15',
    date2024: '2024-10-03',
    date2025: '2025-09-23',
    isMovable: true,
    region: 'All India',
    dishes: [
      'Sabudana Khichdi', 
      'Kuttu Puri', 
      'Singhara Atta Halwa', 
      'Fruit Chaat', 
      'Aloo Jeera', 
      'Samak Rice'
    ],
    significance: 'Dedicated to the worship of Goddess Durga',
    imageUrl: 'https://source.unsplash.com/random/300x200/?navratri,durga'
  },
  {
    id: 'eid',
    name: 'Eid-ul-Fitr',
    description: 'Festival marking the end of Ramadan',
    date2023: '2023-04-22',
    date2024: '2024-04-11',
    date2025: '2025-04-01',
    isMovable: true,
    region: 'All India',
    dishes: [
      'Biryani', 
      'Sheer Khurma', 
      'Kebabs', 
      'Nihari', 
      'Haleem', 
      'Phirni', 
      'Seviyan'
    ],
    significance: 'Marks the end of Ramadan, the Islamic holy month of fasting',
    imageUrl: 'https://source.unsplash.com/random/300x200/?eid,islamic'
  },
  {
    id: 'lohri',
    name: 'Lohri',
    description: 'Harvest festival celebrated in North India',
    date2023: '2023-01-13',
    date2024: '2024-01-13',
    date2025: '2025-01-13',
    isMovable: false,
    region: 'North',
    dishes: [
      'Sarson Ka Saag', 
      'Makki Ki Roti', 
      'Gajak', 
      'Revri', 
      'Peanuts', 
      'Popcorn'
    ],
    significance: 'Marks the end of winter and the harvesting of rabi crops',
    imageUrl: 'https://source.unsplash.com/random/300x200/?bonfire,lohri'
  },
  {
    id: 'pongal',
    name: 'Pongal',
    description: 'Harvest festival celebrated in South India',
    date2023: '2023-01-15',
    date2024: '2024-01-15',
    date2025: '2025-01-15',
    isMovable: false,
    region: 'South',
    dishes: [
      'Pongal Rice', 
      'Sakkarai Pongal', 
      'Ven Pongal', 
      'Payasam', 
      'Vadai'
    ],
    significance: "Thanksgiving festival dedicated to the Sun God",
    imageUrl: 'https://source.unsplash.com/random/300x200/?pongal,rice'
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    description: 'Festival celebrating Lord Ganesha',
    date2023: '2023-09-19',
    date2024: '2024-09-07',
    date2025: '2025-08-28',
    isMovable: true,
    region: 'West',
    dishes: [
      'Modak', 
      'Ladoo', 
      'Puran Poli', 
      'Vada', 
      'Payasam', 
      'Karanji'
    ],
    significance: 'Celebrates the birth of Lord Ganesha',
    imageUrl: 'https://source.unsplash.com/random/300x200/?ganesh,elephant'
  },
  {
    id: 'onam',
    name: 'Onam',
    description: 'Harvest festival celebrated in Kerala',
    date2023: '2023-08-30',
    date2024: '2024-09-15',
    date2025: '2025-09-04',
    isMovable: true,
    region: 'South',
    dishes: [
      'Avial', 
      'Sambar', 
      'Payasam', 
      'Kerala Sadya', 
      'Thoran', 
      'Olan'
    ],
    significance: "Celebrates King Mahabali's annual visit",
    imageUrl: 'https://source.unsplash.com/random/300x200/?kerala,onam'
  },
  {
    id: 'durga-puja',
    name: 'Durga Puja',
    description: 'Festival celebrating Goddess Durga',
    date2023: '2023-10-20',
    date2024: '2024-10-10',
    date2025: '2025-09-30',
    isMovable: true,
    region: 'East',
    dishes: [
      'Luchi', 
      'Khichuri', 
      'Beguni', 
      'Payesh', 
      'Mishti Doi', 
      'Sandesh'
    ],
    significance: 'Celebrates the victory of Goddess Durga over demon Mahishasura',
    imageUrl: 'https://source.unsplash.com/random/300x200/?durga,goddess'
  },
  {
    id: 'janmashtami',
    name: 'Janmashtami',
    description: 'Festival celebrating the birth of Lord Krishna',
    date2023: '2023-08-18',
    date2024: '2024-08-26',
    date2025: '2025-08-16',
    isMovable: true,
    region: 'All India',
    dishes: [
      'Makhan Mishri', 
      'Peda', 
      'Dahi Handi', 
      'Jhangri', 
      'Kheer', 
      'Panchamrit'
    ],
    significance: 'Celebrates the birth of Lord Krishna',
    imageUrl: 'https://source.unsplash.com/random/300x200/?krishna,janmashtami'
  },
  {
    id: 'baisakhi',
    name: 'Baisakhi',
    description: 'Harvest festival in Punjab',
    date2023: '2023-04-14',
    date2024: '2024-04-13',
    date2025: '2025-04-13',
    isMovable: false,
    region: 'North',
    dishes: [
      'Chhole Bhature', 
      'Lassi', 
      'Makki Ki Roti', 
      'Sarson Ka Saag', 
      'Jalebi', 
      'Kheer'
    ],
    significance: 'Marks the Sikh New Year and the foundation of the Khalsa Panth',
    imageUrl: 'https://source.unsplash.com/random/300x200/?punjab,baisakhi'
  },
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    description: 'Festival celebrating the bond between brothers and sisters',
    date2023: '2023-08-30',
    date2024: '2024-08-19',
    date2025: '2025-08-09',
    isMovable: true,
    region: 'All India',
    dishes: [
      'Ladoo', 
      'Jalebi', 
      'Kaju Katli', 
      'Barfi', 
      'Rasgulla', 
      'Gulab Jamun'
    ],
    significance: "Sisters tie a rakhi on their brothers' wrists, symbolizing protection",
    imageUrl: 'https://source.unsplash.com/random/300x200/?rakhi,brotherhood'
  }
];

// Function to get the nearest upcoming festival
export const getUpcomingFestival = (): Festival | undefined => {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Format current date for comparison
  const currentDateStr = format(today, 'yyyy-MM-dd');
  
  // Sort festivals by their date proximity to current date
  const sortedFestivals = [...festivals].sort((a, b) => {
    const dateKeyA = `date${currentYear}` as 'date2023' | 'date2024' | 'date2025';
    const dateKeyB = `date${currentYear}` as 'date2023' | 'date2024' | 'date2025';
    
    const dateA = a[dateKeyA] || '';
    const dateB = b[dateKeyB] || '';
    
    // If either date is missing for current year, push it to the end
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    // If the date has passed, use next year's date
    const effectiveDateA = dateA < currentDateStr ? 
      `${currentYear + 1}${dateA.substring(4)}` : dateA;
    const effectiveDateB = dateB < currentDateStr ? 
      `${currentYear + 1}${dateB.substring(4)}` : dateB;
    
    return effectiveDateA.localeCompare(effectiveDateB);
  });
  
  return sortedFestivals[0];
};

// Function to check if today is a festival
export const isTodayFestival = (): Festival | undefined => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentDateStr = format(today, 'yyyy-MM-dd');
  
  // Find a festival that matches today's date
  return festivals.find(festival => {
    const dateKey = `date${currentYear}` as 'date2023' | 'date2024' | 'date2025';
    return festival[dateKey] === currentDateStr;
  });
};

// Get special dishes for a given festival
export const getFestivalDishes = (festivalId: string): string[] => {
  const festival = festivals.find(f => f.id === festivalId);
  return festival ? festival.dishes : [];
};

// Get festival by ID
export const getFestivalById = (id: string): Festival | undefined => {
  return festivals.find(festival => festival.id === id);
};

// Get all festivals
export const getAllFestivals = (): Festival[] => {
  return festivals;
};