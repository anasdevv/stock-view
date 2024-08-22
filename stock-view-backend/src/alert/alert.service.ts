import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FirebaseService } from 'src/auth/firebase.service';
import { MailerService } from 'src/mailer/mailer.service';
import { StockService } from 'src/stock/stock.service';
import { getYesterdayDate } from 'src/utils/helper';

@Injectable()
export class AlertService {
  constructor(
    private readonly firebaseSerice: FirebaseService,
    private readonly mailerService: MailerService,
    private readonly stockService: StockService,
  ) {}
  async handleAlert() {}
  @Cron('45 * * * * *')
  async handleCron() {
    console.log('hello world');
    const users = await this.firebaseSerice.getUsersForAlert();
    console.log('users ', users);
    for (const user of users) {
      const stockPrice = await this.stockService.getAllIndexData({
        date: getYesterdayDate(), //we can not use current date because its a paid feature
        multiplier: '1',
        timespan: 'minute',
        symbol: user.stock,
        limit: 1,
      });
      console.log('stock price', stockPrice);

      //   @ts-ignore
      const currentPrice = stockPrice.results[0].c;
      if (user.direction === 'above' && currentPrice > user.price) {
        this.mailerService.sendMail({
          message: `Hi ,

This email is to notify you that the price of the ${user.stcok} index has reached ${currentPrice} which is **above** your set threshold of ${user.price}.

You may want to consider taking action based on your investment strategy.`,
          subject: `⚠️ Price Alert: ${user.stock} Above Your Threshold`,
          to: user.email,
        });
      }
      if (user.direction === 'below' && currentPrice < user.price) {
        this.mailerService.sendMail({
          to: user.email,
          subject: ` Price Alert: ${user.index} Below Your Threshold`,
          message: `Hi ,

          This email is to notify you that the price of the ${user.stock} index has reached ${currentPrice} which is **below** your set threshold of ${user.price}.
          
          This might be an opportunity to consider buying into the index, depending on your investment strategy.`,
        });
      }
    }
  }
}
