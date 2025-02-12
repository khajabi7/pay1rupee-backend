import { Controller, Post, Get, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment() {
    return this.paymentService.generateUPILink();
  }

  @Post('verify')
  async verifyPayment(@Body('transactionId') transactionId: string) {
    return this.paymentService.verifyPayment(transactionId);
  }

  @Get('count')
  async getCount() {
    return this.paymentService.getPaymentCount();
  }
}

