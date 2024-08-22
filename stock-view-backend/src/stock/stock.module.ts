import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { HttpModule } from '@nestjs/axios';
import { FirebaseModule } from 'src/auth/firebase.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule, FirebaseModule],
  providers: [StockService],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}
