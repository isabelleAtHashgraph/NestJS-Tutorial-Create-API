import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    //instantiate Prisma
    super({
      //will call the class PrismaClient that was extended
      datasources: {
        db: {
          url: 'postgresql://postgres:123@localhost:5434/nest?schema=public',
        },
      },
    });
  }
}
