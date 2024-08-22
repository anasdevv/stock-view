import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from 'src/mailer/mailer.module';
import { FirebaseModule } from 'src/auth/firebase.module';
import { StockModule } from 'src/stock/stock.module';
import { StockService } from 'src/stock/stock.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailerModule,
    FirebaseModule,
    StockModule,
  ],
  providers: [AlertService],
})
export class AlertModule {}
