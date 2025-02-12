// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async generateUPILink() {
    // Simulated UPI link (Replace with actual dynamic link generation)
    return {
      upiLink: 'upi://pay?pa=sirajsabir@ybl&pn=Pay1Rupee&tn=1%20Rupee%20Challenge&am=1.00&cu=INR',
    }; 
  }

  async verifyPayment(transactionId: string) {
     // 🔹 Check if the transactionId already exists in the database
  const existingPayment = await this.paymentRepository.findOne({
    where: { transactionId },
  });

  if (existingPayment) {
    return { success: false, message: 'Transaction ID already used' };
  }

    // 🔹 Call PhonePe API for verification
    const isPaymentValid = await this.validateTransactionWithPhonePe(transactionId);

   if (!isPaymentValid) {
     return { success: false, message: 'Invalid or unsuccessful transaction' };
   }
 
  // 🔹 Save the valid transaction
      const payment = this.paymentRepository.create({
      transactionId,
      status: 'success',
    });
    await this.paymentRepository.save(payment);
    return { success: true };
  }
 /**
   * 🔹 Function to validate UPI transaction via PhonePe API
   */
 async validateTransactionWithPhonePe(transactionId: string): Promise<boolean> {
  try {
    const url = `https://api.phonepe.com/apis/hermes/v1/transaction/${transactionId}/status`;

    // PhonePe requires a merchant ID and salt key for authentication
    const headers = {
      'Content-Type': 'application/json',
      'X-Merchant-Id': 'YOUR_PHONEPE_MERCHANT_ID',
      'X-Signature': this.generateSignature(transactionId),
    };

    // 🔹 Send request to PhonePe
    const response = await axios.get(url, { headers });

    // 🔹 Check if the payment was successful
    return response.data && response.data.success;
  } catch (error) {
    console.error('PhonePe Verification Error:', error.message);
    return false;
  }
}

/**
 * 🔹 Function to generate a secure signature for PhonePe API
 */
generateSignature(transactionId: string): string {
  const saltKey = 'YOUR_PHONEPE_SALT_KEY';
  const data = `/v3/transaction/${transactionId}/status${saltKey}`;
  return require('crypto').createHash('sha256').update(data).digest('hex');
}

  async getPaymentCount() {
    const count = await this.paymentRepository.count({ where: { status: 'success' } });
    return { totalCount: count };
  }
}