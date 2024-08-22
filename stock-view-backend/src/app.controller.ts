import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/test')
  @UseGuards(AuthGuard)
  getHi(@Req() request: Request): string {
    return this.appService.getHello();
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
