import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { WelcomeTemplate } from './templates/welcome.template';
import { InvoiceTemplate } from './templates/invoice.template';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('welcome')
  async sendWelcome(@Query('to') to: string) {
    return this.mailService.sendMail(to, 'Welcome', WelcomeTemplate('Ragul'));
  }

 
  @Get('invoice')
  async sendInvoice(@Query('to') to: string) {
    return this.mailService.sendMail(to, 'Your Invoice', InvoiceTemplate('INV-1001', 2500));
  }
}
