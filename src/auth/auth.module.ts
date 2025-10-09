// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { PrismaModule } from 'src/prisma/prisma.module';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { JwtStrategy } from './jwt.strategy';
// import googleOauthConfig from './config/google.oauth.config';
// import { GoogleStrategy } from './strategy/google.strategy';

// @Module({
//   imports: [
//     PrismaModule,
//     PassportModule,
//     ConfigModule,
//     ConfigModule.forFeature(googleOauthConfig),

//     // ✅ Corrected JwtModule registration
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET') || 'JWT_SECRET',
//         signOptions: { expiresIn: '1h' },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy, GoogleStrategy],
//   exports: [JwtStrategy, PassportModule],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import googleOauthConfig from './config/google.oauth.config';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule.forFeature(googleOauthConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'JWT_SECRET',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}