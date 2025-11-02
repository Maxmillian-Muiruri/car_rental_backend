// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { ReservationService } from './reservation.service';
// import { CreateReservationDto } from './dto/create-reservation.dto';
// import { UpdateReservationDto } from './dto/update-reservation.dto';
//
// @Controller('reservation')
// export class ReservationController {
//   constructor(private readonly reservationService: ReservationService) {}
//
//   @Post()
//   create(@Body() createReservationDto: CreateReservationDto) {
//     return this.reservationService.create(createReservationDto);
//   }
//
//   @Get()
//   findAll() {
//     return this.reservationService.findAll();
//   }
//
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.reservationService.findOne(+id);
//   }
//
//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updateReservationDto: UpdateReservationDto,
//   ) {
//     return this.reservationService.update(+id, updateReservationDto);
//   }
//
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.reservationService.remove(+id);
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
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { CurrentUser } from '../auth/decorators/current.user.decorator';
import { CustomerRole } from '../customer/entities/customer.entity';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Authenticated users can create reservations
  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: any,
  ) {
    // Ensure user is reserving for themselves (unless admin)
    if (
      user.sub !== createReservationDto.customerId &&
      user.role !== CustomerRole.ADMIN
    ) {
      throw new ForbiddenException(
        'You can only create reservations for yourself',
      );
    }
    return this.reservationService.create(createReservationDto);
  }

  // Admins can view all reservations
  @Roles(CustomerRole.ADMIN)
  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  // Users can view their own reservations, admins can view any
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const reservation = await this.reservationService.findOne(+id);
    if (
      reservation.customerId !== user.sub &&
      user.role !== CustomerRole.ADMIN
    ) {
      throw new ForbiddenException('You can only view your own reservations');
    }
    return reservation;
  }

  // Users can update their own reservations, admins can update any
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @CurrentUser() user: any,
  ) {
    const reservation = await this.reservationService.findOne(+id);
    if (
      reservation.customerId !== user.sub &&
      user.role !== CustomerRole.ADMIN
    ) {
      throw new ForbiddenException('You can only update your own reservations');
    }
    return this.reservationService.update(+id, updateReservationDto);
  }

  // Users can delete their own reservations, admins can delete any
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const reservation = await this.reservationService.findOne(+id);
    if (
      reservation.customerId !== user.sub &&
      user.role !== CustomerRole.ADMIN
    ) {
      throw new ForbiddenException('You can only delete your own reservations');
    }
    return this.reservationService.remove(+id);
  }

  // Get current user's reservations
  @Get('my/reservations')
  getMyReservations(@CurrentUser() user: any) {
    return this.reservationService.findByCustomerId(user.sub);
  }
}
