import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {v2 as cloudinary} from "cloudinary"
import * as fs from "fs"

@Injectable()
export class FileUploadService {
    constructor (private readonly prisma: PrismaService) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        })
    }

    async uploadFile(file: Express.Multer.file) {
        try {

            const uploadResult = await this.uploadFileToCloudinary(file.path)

            const newlySaveFile = await this.prisma.imageurls.create({
                 data: {
                    publicId: uploadResult.public_id,
                    url: uploadResult.secure_url
                 }
            })

            fs.unlinkSync(file.path)

            return newlySaveFile
            
        } catch (error) {
           if(file.path && fs.existsSync(file.path)){
             fs.unlinkSync(file.path)
           } 

           throw new InternalServerErrorException('File upload failed.')
        }
    }

    private uploadFileToCloudinary(filePath: string) : Promise<any> {
         return new Promise((resolve, reject) => {
           cloudinary.uploader.upload(filePath, (error, result) => {
            if(error) reject(error)
            resolve(result)
           })
         })
    }
    
}
