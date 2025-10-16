// import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// // import {PrismaClient} from "@prisma/client"

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
   
//     async onModuleInit() {
//         await this.$connect()
//     }

//     async onModuleDestroy() {
//         await this.$disconnect()
//     }
// }


import { Injectable, type OnModuleDestroy, type OnModuleInit  } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async reconnect() {
    try {
      await this.$disconnect();
      await this.$connect();
      console.log('🔁 Prisma reconnected successfully');
    } catch (err) {
      console.error('❌ Prisma reconnection failed', err);
    }
  }}
