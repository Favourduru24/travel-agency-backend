import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TripModule } from './trip/trip.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
    isGlobal: true
  }), 
    PrismaModule, TripModule, DashboardModule

],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
