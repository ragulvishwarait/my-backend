import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  private transporter;

 constructor(private configService: ConfigService) {
  this.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:  587, 
    secure: false,
    auth: {
      user: "ragulvishwa42@gmail.com",
      pass: "sdaqfzprdkijjcio",
    },
  });
 }

  async sendMail(to: string, subject: string, html: string) {
    return await this.transporter.sendMail({
      from: `"My App" <${this.configService.get<string>('SMTP_USER')}>`,
      to,
      subject,
      html,
      attachments: [
    {
      filename: 'welcome.pdf',
      path: './attachments/sample.pdf',
    },
    {
      filename: 'logo.png',
      path:'./attachments/logo.png',
      cid: 'logo@myapp', 
    },
  ],
    });
  }
}
