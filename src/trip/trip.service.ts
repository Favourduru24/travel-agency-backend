import { Injectable } from '@nestjs/common';
import { TripDto } from './dto/trip.dto';
import {generateText} from "ai"
import {google} from '@ai-sdk/google'
import { PrismaService } from 'src/prisma/prisma.service';
import { AITripResponse } from './trip';
import {v2 as cloudinary} from "cloudinary"

@Injectable()
export class TripService {

  constructor (private readonly prisma: PrismaService) {
     cloudinary.config({
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_KEY,
                api_secret: process.env.CLOUDINARY_SECRET
            })
  }

async createNewTrip(tripDto: TripDto) {
  const { country, numberOfDays, travelStyle, interests, budget, groupType, userId } = tripDto;

  // 1️⃣ Generate trip data with AI
     try {
       const response = await generateText({
                    model: google("gemini-2.0-flash-001"),
                   prompt: `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
                      Budget: '${budget}'
                      Interests: '${interests}'
                      TravelStyle: '${travelStyle}'
                      GroupType: '${groupType}'
                      Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
                      {
                      "name": "A descriptive title for the trip",
                      "description": "A brief description of the trip and its highlights not exceeding 100 words",
                      "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
                      "duration": ${numberOfDays},
                      "budget": "${budget}",
                      "travelStyle": "${travelStyle}",
                      "country": "${country}",
                      "interests": ${interests},
                      "groupType": "${groupType}",
                      "bestTimeToVisit": [
                        '🌸 Season (from month to month): reason to visit',
                        '☀️ Season (from month to month): reason to visit',
                        '🍁 Season (from month to month): reason to visit',
                        '❄️ Season (from month to month): reason to visit'
                      ],
                      "weatherInfo": [
                        '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                        '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                        '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                        '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
                      ],
                      "location": {
                        "city": "name of the city or region",
                        "coordinates": [latitude, longitude],
                        "openStreetMap": "link to open street map"
                      },
                      "itinerary": [
                      {
                        "day": 1,
                        "location": "City/Region Name",
                        "activities": [
                          {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
                          {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
                          {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
                        ]
                      },
                      ...
                      ]
                      }`
     });


  const data = this.parseMarkdownToJson<AITripResponse>(response.text);
  if (!data) throw new Error("Invalid AI JSON format");

  // 2️⃣ Get Unsplash images
  const unsplashRes = await fetch(
    `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&per_page=3&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );
  const unsplashData = await unsplashRes.json();
  const imageUrls = unsplashData.results?.map((img: any) => img.urls.regular) || [];

   
  // 3️⃣ Upload images to Cloudinary
  const cloudinaryResults = await this.uploadFilesToCloudinary(imageUrls);

  // 4️⃣ Run all DB operations atomically
  const location = await this.prisma.location.create({
  data: {
    city: data.location.city,
    latitude: data.location.coordinates[0],
    longitude: data.location.coordinates[1],
    openStreetMap: data.location.openStreetMap,
  },
});

// 2️⃣ Create trip
const trip = await this.prisma.trip.create({
  data: {
    userId,
    name: data.name,
    description: data.description,
    estimatedPrice: data.estimatedPrice,
    payment_link: '',
    duration: data.duration,
    budget: data.budget,
    travelStyle: data.travelStyle,
    country: data.country,
    interests: data.interests,
    groupType: data.groupType,
    bestTimeToVisit: data.bestTimeToVisit,
    weatherInfo: data.weatherInfo,
    locationId: location.id,
    itinerary: {
      create: data.itinerary.map((day) => ({
        day: day.day,
        location: day.location,
        activities: {
          create: day.activities.map((a) => ({
            time: a.time,
            description: a.description,
          })),
        },
      })),
    },
  },
  include: {
    itinerary: { include: { activities: true } },
    location: true,
    images: true
  },
});

// 3️⃣ Create image URLs
await this.prisma.imageUrl.createMany({
  data: cloudinaryResults.map((res) => ({
    publicId: res.public_id,
    url: res.secure_url,
    tripId: trip.id,
  })),
});

return trip;  
     } catch(error) {
       console.error('Something went wrong', error)
     }
   
}

// async getUserTrips(userId: number) {
//   return this.prisma.trip.findMany({
//     where: { userId },
//     include: {
//       images: true, // ✅ include images from ImageUrl model
//       itinerary: {
//         include: {
//           activities: true,
//         },
//       },
//       location: true,
//     },
//     orderBy: { createdAt: 'desc' },
//   });
// }

async getUserTrips(userId: number, page = 1, limit = 10) {
  const skip = (page - 1) * limit; 

  const [trips, total] = await this.prisma.$transaction([
    this.prisma.trip.findMany({
      where: { userId },
      include: {
        images: true,
        itinerary: {
          include: { activities: true },
        },
        location: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    this.prisma.trip.count({
      where: { userId: Number(userId) },
    }),
  ]);

  return {
    data: trips,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}


async getTripById(id: number) {
  return this.prisma.trip.findUnique({
    where: { id },
    include: {
      images: true,  
      itinerary: {
        include: { activities: true },
      },
      location: true,
    },
  });
}

async getAllTrips(page = 1, limit = 1) {

   const skip = (page - 1) * limit

   const [trip, total] = await this.prisma.$transaction([
     this.prisma.trip.findMany({
       include: {
         images: true,
         itinerary: {
             include: {
              activities: true
             }
         },
         location: true
       },
       orderBy: {id: 'asc'},
       take: limit,
       skip
     }),
      this.prisma.trip.count()
   ])

   return {
    data: trip,
    meta: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit)
    }
   }
}

private async uploadFilesToCloudinary(fileUrls: string[]) {
  try {
    // Upload all images in parallel
    const uploadPromises = fileUrls.map((fileUrl) =>
      cloudinary.uploader.upload(fileUrl, {
        folder: "trip_images", // optional folder organization in Cloudinary
        transformation: [{ width: 1280, height: 720, crop: "limit" }], // optional resizing
      })
    );

    const results = await Promise.all(uploadPromises);
    return results; // returns an array of upload result objects (public_id, secure_url, etc.)
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload images to Cloudinary");
  }
}

private parseMarkdownToJson<T>(markdownText: string): T | null {
  const regex = /```json\n([\s\S]+?)\n```/;
  const match = markdownText.match(regex);
  
  try {
    const jsonText = match ? match[1] : markdownText; // fallback if no ```json``` block
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}
          
    }
