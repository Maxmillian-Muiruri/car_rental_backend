import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { CustomerRole } from '../customer/entities/customer.entity';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  // Only admins can create cars
  @Roles(CustomerRole.ADMIN)
  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  // Public - anyone can view all cars
  @Public()
  @Get()
  findAll() {
    return this.carService.findAll();
  }

  // Public - anyone can view a single car
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  // Only admins can update cars
  @Roles(CustomerRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  // Only admins can delete cars
  @Roles(CustomerRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
