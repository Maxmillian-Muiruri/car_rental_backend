// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { RentalService } from './rental.service';
// import { CreateRentalDto } from './dto/create-rental.dto';
// import { UpdateRentalDto } from './dto/update-rental.dto';
//
// @Controller('rental')
// export class RentalController {
//   constructor(private readonly rentalService: RentalService) {}
//
//   @Post()
//   create(@Body() createRentalDto: CreateRentalDto) {
//     return this.rentalService.create(createRentalDto);
//   }
//
//   @Get()
//   findAll() {
//     return this.rentalService.findAll();
//   }
//
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.rentalService.findOne(+id);
//   }
//
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto) {
//     return this.rentalService.update(+id, updateRentalDto);
//   }
//
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.rentalService.remove(+id);
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
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { CurrentUser } from '../auth/decorators/current.user.decorator';
import { CustomerRole } from '../customer/entities/customer.entity';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  // Authenticated users can create rentals
  @Post()
  create(@Body() createRentalDto: CreateRentalDto, @CurrentUser() user: any) {
    // Ensure user is renting for themselves (unless admin)
    if (
      user.sub !== createRentalDto.customerId &&
      user.role !== CustomerRole.ADMIN
    ) {
      throw new ForbiddenException('You can only create rentals for yourself');
    }
    return this.rentalService.create(createRentalDto);
  }

  // Admins can view all rentals
  @Roles(CustomerRole.ADMIN)
  @Get()
  findAll() {
    return this.rentalService.findAll();
  }

  // Users can view their own rentals, admins can view any
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const rental = await this.rentalService.findOne(+id);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (rental.customerId !== user.sub && user.role !== CustomerRole.ADMIN) {
      throw new ForbiddenException('You can only view your own rentals');
    }
    return rental;
  }

  // Users can update their own rentals, admins can update any
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRentalDto: UpdateRentalDto,
    @CurrentUser() user: any,
  ) {
    const rental = await this.rentalService.findOne(+id);
    if (rental.customerId !== user.sub && user.role !== CustomerRole.ADMIN) {
      throw new ForbiddenException('You can only update your own rentals');
    }
    return this.rentalService.update(+id, updateRentalDto);
  }

  // Only admins can delete rentals
  @Roles(CustomerRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalService.remove(+id);
  }

  // Get current user's rentals
  @Get('my/rentals')
  getMyRentals(@CurrentUser() user: any) {
    return this.rentalService.findByCustomerId(user.sub);
  }
}
