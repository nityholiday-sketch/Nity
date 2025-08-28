export type Package = {
  id: string;
  slug: string;
  name: string;
  image: string;
  description: string;
  price: number;
  duration: string;
  transport: ('Train' | 'Flight' | 'Heli' | 'Bus')[];
  featured: boolean;
  itinerary: { day: number; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
};

export const packages: Package[] = [
  {
    id: 'akhil-bhartiya-char-dham-yatra-2025',
    slug: 'akhil-bhartiya-char-dham-yatra-2025',
    name: 'Akhil Bhartiya Char Dham Yatra by Train 2025',
    image: 'https://picsum.photos/600/400?random=21',
    description: 'Experience India’s most sacred pilgrimage circuit. Visit all four Char Dhams in one comprehensive, expertly guided tour by train.',
    price: 85000,
    duration: '13 Days/12 Nights',
    transport: ['Train'],
    featured: true,
    itinerary: [
      {
        day: 1,
        title: 'Arrival and Acclimatization in Badrinath',
        description: 'Arrive in the Himalayas. Acclimatize and visit Badrinath Temple for darshan. Take a holy dip in Tapt Kund and explore the nearby Mana Village, the last village on the Indo-Tibetan border. Overnight stay in Joshimath/Badrinath.'
      },
      {
        day: 4,
        title: 'Journey to Dwarka',
        description: 'Travel to the western coast of India. Visit the legendary Dwarkadhish Temple, take a dip at Gomti Ghat, and seek blessings at the Nageshwar Jyotirlinga Temple. Overnight stay in Dwarka.'
      },
      {
        day: 7,
        title: 'Exploring Puri',
        description: 'Journey to the eastern shore to visit the Jagannath Temple with special VIP Darshan. Explore the architectural marvel of the Konark Sun Temple and enjoy a boat ride on the serene Chilka Lake. Overnight stay in Puri.'
      },
      {
        day: 10,
        title: 'Pilgrimage to Rameshwaram',
        description: 'Travel to the southern tip of India. Perform rituals at the Ramanathaswamy Temple, bathing in its 22 holy wells. Visit Dhanushkodi and see the mythical Ram Setu. Overnight stay in Rameshwaram.'
      },
      {
        day: 13,
        title: 'Return Journey',
        description: 'After a final darshan and breakfast, proceed for your return journey by train, filled with divine blessings and memories.'
      }
    ],
    inclusions: [
      '3-star hotel accommodation',
      'Pure vegetarian meals (Breakfast, Lunch, Dinner)',
      'All transfers by AC coach',
      'Local guides at each destination',
      'VIP Darshan at all main temples',
      'All applicable taxes and permits',
      'Travel insurance',
      'Group escort/assistance',
      'Train tickets to and from starting point'
    ],
    exclusions: [
      'Any personal expenses',
      'Donations at temples',
      'Anything not mentioned in inclusions'
    ]
  }
];
