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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { CustomerRole } from './entities/customer.entity';
import { CurrentUser } from '../auth/decorators/current.user.decorator';
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Only admins can create customers directly (normal users use signup)
  @Roles(CustomerRole.ADMIN)
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  // Public - anyone can view all customers (or make it admin only)
  @Public()
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  // Get current user's profile
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.customerService.findOne(user.sub);
  }

  // Get customer by ID - only themselves or admin
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    // Check if user is trying to access their own data or is admin
    if (user.sub !== +id && user.role !== CustomerRole.ADMIN) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.customerService.findOne(+id);
  }

  // Update customer - only themselves or admin
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentUser() user: any,
  ) {
    // Check if user is trying to update their own data or is admin
    if (user.sub !== +id && user.role !== CustomerRole.ADMIN) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.customerService.update(+id, updateCustomerDto);
  }

  // Delete customer - only admins
  @Roles(CustomerRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
