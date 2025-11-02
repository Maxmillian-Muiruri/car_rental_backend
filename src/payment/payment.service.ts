import {
  HttpException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Rental } from '../rental/entities/rental.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
  ) {}

  // ✅ Get all payments
  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['rental'],
    });
  }

  // ✅ Get one payment by ID
  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentId: id },
      relations: ['rental'],
    });
    if (!payment)
      throw new NotFoundException(`Payment with ID ${id} not found`);
    return payment;
  }

  // ✅ Create new payment
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      // Validate rental exists
      const rental = await this.rentalRepository.findOne({
        where: { rentalId: createPaymentDto.rentalId },
      });
      if (!rental) {
        throw new NotFoundException('Rental not found');
      }

      // Check if payment amount exceeds rental total
      const existingPayments = await this.paymentRepository.find({
        where: { rentalId: createPaymentDto.rentalId },
      });

      const totalPaid = existingPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0,
      );
      const remainingAmount = rental.totalAmount - totalPaid;

      if (createPaymentDto.amount > remainingAmount) {
        throw new BadRequestException(
          `Payment amount (${createPaymentDto.amount}) exceeds remaining amount (${remainingAmount})`,
        );
      }

      const newPayment = this.paymentRepository.create({
        ...createPaymentDto,
        paymentDate: createPaymentDto.paymentDate
          ? new Date(createPaymentDto.paymentDate)
          : new Date(),
      });

      return await this.paymentRepository.save(newPayment);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException('Error creating payment: ' + error.message, 500);
    }
  }

  // ✅ Update payment
  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  // ✅ Delete payment
  async remove(id: number): Promise<{ message: string }> {
    const payment = await this.findOne(id);
    await this.paymentRepository.delete(id);
    return { message: `Payment #${id} deleted successfully` };
  }

  // ✅ Get payments by rental ID
  async findByRentalId(rentalId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { rentalId },
      relations: ['rental'],
    });
  }

  // ✅ Get payments by customer ID
  async findByCustomerId(customerId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { rental: { customer: { customerId } } }, // nested relation
      relations: ['rental', 'rental.customer'],
    });
  }

}
