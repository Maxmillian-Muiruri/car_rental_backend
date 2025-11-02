// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { PaymentService } from './payment.service';
// import { CreatePaymentDto } from './dto/create-payment.dto';
// import { UpdatePaymentDto } from './dto/update-payment.dto';
//
// @Controller('payment')
// export class PaymentController {
//   constructor(private readonly paymentService: PaymentService) {}
//
//   @Post()
//   create(@Body() createPaymentDto: CreatePaymentDto) {
//     return this.paymentService.create(createPaymentDto);
//   }
//
//   @Get()
//   findAll() {
//     return this.paymentService.findAll();
//   }
//
//   @Get('rental/:rentalId')
//   findByRentalId(@Param('rentalId') rentalId: string) {
//     return this.paymentService.findByRentalId(+rentalId);
//   }
//
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.paymentService.findOne(+id);
//   }
//
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
//     return this.paymentService.update(+id, updatePaymentDto);
//   }
//
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.paymentService.remove(+id);
//   }
// }

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { CurrentUser } from  '../auth/decorators/current.user.decorator';
import { CustomerRole } from '../customer/entities/customer.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Authenticated users can create payments
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @CurrentUser() user: any) {
    // Add logic to verify the rental belongs to the user
    return this.paymentService.create(createPaymentDto);
  }

  // Admins can view all payments
  @Roles(CustomerRole.ADMIN)
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  // Get payments for a specific rental
  @Get('rental/:rentalId')
  async findByRental(
    @Param('rentalId') rentalId: string,
    @CurrentUser() user: any,
  ) {
    // Add logic to verify rental belongs to user
    return this.paymentService.findByRentalId(+rentalId);
  }

  // Users can view their own payments, admins can view any
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const payment = await this.paymentService.findOne(+id);
    // Add logic to check if payment belongs to user's rental
    return payment;
  }

  // Only admins can update payments
  @Roles(CustomerRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  // Only admins can delete payments
  @Roles(CustomerRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }

  // Get current user's payments
  @Get('my/payments')
  getMyPayments(@CurrentUser() user: any) {
    return this.paymentService.findByCustomerId(user.sub);
  }
}
