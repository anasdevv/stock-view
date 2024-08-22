import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { GetIndexDataDto } from './dto/get-index-data.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @UseGuards(AuthGuard)
  @Get('indices')
  async getIndices() {
    return this.stockService.getAllIndicesSymbols();
  }

  @UseGuards(AuthGuard)
  @Get('indices/:symbol')
  async getIndexData(
    @Param('symbol') symbol: string,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: GetIndexDataDto,
  ) {
    const { date, timespan, multiplier } = query;
    return this.stockService.getAllIndexData({
      symbol,
      date,
      timespan,
      multiplier,
    });
  }
}
