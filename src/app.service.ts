import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Nest.js is Pristine writing code';
  }
}
// DATABASE_URI='postgresql://neondb_owner:npg_tdC4PF5OSuyH@ep-cold-cell-adz4nwtt-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

  