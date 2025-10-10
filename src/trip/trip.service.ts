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

   async createNewTrip (tripDto: TripDto) {
      const {
        country,
        numberOfDays,
        travelStyle,
        interests,
        budget,
        groupType,
        userId} = tripDto
        
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
        if (!data) throw new Error('Invalid AI JSON format');

        const imageResponse = await fetch(`https://api.unsplash.com/search/photo?query=${country} ${interests} ${travelStyle}&client_id=`)// ${unsplashApiKey}

        const imageUrls = (await imageResponse.json()).results.slice(0, 3).map((res: any) => res.urls?.regular || null)

         const uploadResult = await this.uploadFileToCloudinary(imageUrls)


          const newImageUrl = await this.prisma.imageurls.create({
                          data: {
                             publicId: uploadResult.public_id,
                             url: uploadResult.secure_url
                          }
                     })

        const location = await this.prisma.location.create({
           data: {
             city: data.location.city,
             latitude: data.location.coordinates[0],
             longitude: data.location.coordinates[1],
             openStreetMap: data.location.openStreetMap,
           },
          });

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
                    ImageUrlId: newImageUrl.id,
                    itinerary: {
                      create: data.itinerary.map((day: any) => ({
                        day: day.day,
                        location: day.location,
                        activities: {
                          create: day.activities.map((activity: any) => ({
                            time: activity.time,
                            description: activity.description,
                        })),
                        },
                      })),
                    },
                  },
                  include: {
                    itinerary: { include: { activities: true } },
                    location: true,
                  },
                });

                return trip;

   }

   private uploadFileToCloudinary(filePath: string[]) : Promise<any> {
            return new Promise((resolve, reject) => {
              cloudinary.uploader.upload(filePath, (error: any, result) => {
               if(error) reject(error)
               resolve(result)
              })
            })
       }

        private parseMarkdownToJson<T>(markdownText: string): T | null {
            const regex = /```json\n([\s\S]+?)\n```/;
            const match = markdownText.match(regex);
          
            if (match && match[1]) {
              try {
                return JSON.parse(match[1]);
              } catch (error) {
                console.error("Error parsing JSON:", error);
                return null;
              }
            }
            console.error("No valid JSON found in markdown text.");
            return null;
          }

    }
