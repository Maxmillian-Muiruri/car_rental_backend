import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { Car } from '../car/entities/car.entity';
import { Customer } from '../customer/entities/customer.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // ✅ Get all rentals
  async findAll(): Promise<Rental[]> {
    return this.rentalRepository.find({
      relations: ['car', 'customer', 'payments'],
    });
  }

  // ✅ Get one rental by ID
  async findOne(id: number): Promise<Rental> {
    const rental = await this.rentalRepository.findOne({
      where: { rentalId: id },
      relations: ['car', 'customer', 'payments'],
    });
    if (!rental) throw new NotFoundException(`Rental with ID ${id} not found`);
    return rental;
  }

  // ✅ Create new rental
  async create(createRentalDto: CreateRentalDto): Promise<Rental> {
    try {
      // Validate car exists and is available
      const car = await this.carRepository.findOne({
        where: { carId: createRentalDto.carId },
      });
      if (!car) {
        throw new NotFoundException('Car not found');
      }
      if (!car.availability) {
        throw new ConflictException('Car is not available for rental');
      }

      // Validate customer exists
      const customer = await this.customerRepository.findOne({
        where: { customerId: createRentalDto.customerId },
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // Validate dates
      const startDate = new Date(createRentalDto.rentalStartDate);
      const endDate = new Date(createRentalDto.rentalEndDate);
      
      if (startDate >= endDate) {
        throw new BadRequestException('Rental start date must be before end date');
      }

      if (startDate < new Date()) {
        throw new BadRequestException('Rental start date cannot be in the past');
      }

      // Check for overlapping rentals
      const overlappingRental = await this.rentalRepository
        .createQueryBuilder('rental')
        .where('rental.carId = :carId', { carId: createRentalDto.carId })
        .andWhere(
          '(rental.rentalStartDate <= :endDate AND rental.rentalEndDate >= :startDate)',
          { startDate, endDate }
        )
        .getOne();

      if (overlappingRental) {
        throw new ConflictException('Car is already rented during this period');
      }

      const newRental = this.rentalRepository.create({
        ...createRentalDto,
        rentalStartDate: startDate,
        rentalEndDate: endDate,
      });

      // Update car availability
      car.availability = false;
      await this.carRepository.save(car);

      return await this.rentalRepository.save(newRental);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Error creating rental: ' + error.message,
        500,
      );
    }
  }

  // ✅ Update rental
  async update(id: number, updateRentalDto: UpdateRentalDto): Promise<Rental> {
    const rental = await this.findOne(id);
    Object.assign(rental, updateRentalDto);
    return this.rentalRepository.save(rental);
  }

  // ✅ Delete rental
  async remove(id: number): Promise<{ message: string }> {
    const rental = await this.findOne(id);
    
    // Update car availability
    const car = await this.carRepository.findOne({
      where: { carId: rental.carId },
    });
    if (car) {
      car.availability = true;
      await this.carRepository.save(car);
    }

    await this.rentalRepository.delete(id);
    return { message: `Rental #${id} deleted successfully` };
  }
}
