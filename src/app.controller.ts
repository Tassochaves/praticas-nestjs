import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private prisma: PrismaService,) {}

  @Get()
  async getHello() {
    return await this.prisma.user.findMany();
  }
}
