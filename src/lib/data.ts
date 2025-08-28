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
};

export const packages: Package[] = [];
