export interface AITripResponse {
  name: string;
  description: string;
  estimatedPrice: string;
  duration: number;
  budget: string;
  travelStyle: string;
  country: string;
  interests: string
  groupType: string;
  bestTimeToVisit: string[];
  weatherInfo: string[];
  location: {
    city: string;
    coordinates: [number, number];
    openStreetMap: string;
  };
  itinerary: {
    day: number;
    location: string;
    activities: {
      time: string;
      description: string;
    }[];
  }[];
}