import { Injectable } from '@nestjs/common';
import { MailerService as NestjsMailerService } from '@nestjs-modules/mailer';
interface SendEmailInterface {
  to: string;
  message: string;
  subject: string;
}
@Injectable()
export class MailerService {
  constructor(private readonly nestMailerService: NestjsMailerService) {}

  sendMail({ message, to, subject }: SendEmailInterface) {
    this.nestMailerService.sendMail({
      from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
      to,
      subject,
      text: message,
    });
  }
}
