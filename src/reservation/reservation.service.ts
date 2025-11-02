import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Car } from '../car/entities/car.entity';
import { Customer } from '../customer/entities/customer.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // ✅ Get all reservations
  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: ['car', 'customer'],
    });
  }

  // ✅ Get one reservation by ID
  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId: id },
      relations: ['car', 'customer'],
    });
    if (!reservation)
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    return reservation;
  }

  // find customer by id
  async findByCustomerId(customerId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { customer: { customerId } }, // Nested object for relations
      relations: ['car', 'customer'],
    });
  }
  // ✅ Create new reservation
  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    try {
      // Validate car exists and is available
      const car = await this.carRepository.findOne({
        where: { carId: createReservationDto.carId },
      });
      if (!car) {
        throw new NotFoundException('Car not found');
      }
      if (!car.availability) {
        throw new ConflictException('Car is not available for reservation');
      }

      // Validate customer exists
      const customer = await this.customerRepository.findOne({
        where: { customerId: createReservationDto.customerId },
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // Validate dates
      const pickupDate = new Date(createReservationDto.pickupDate);
      const returnDate = new Date(createReservationDto.returnDate);

      if (pickupDate >= returnDate) {
        throw new BadRequestException('Pickup date must be before return date');
      }

      if (pickupDate < new Date()) {
        throw new BadRequestException('Pickup date cannot be in the past');
      }

      // Check for overlapping reservations
      const overlappingReservation = await this.reservationRepository
        .createQueryBuilder('reservation')
        .where('reservation.carId = :carId', {
          carId: createReservationDto.carId,
        })
        .andWhere(
          '(reservation.pickupDate <= :returnDate AND reservation.returnDate >= :pickupDate)',
          { pickupDate, returnDate },
        )
        .getOne();

      if (overlappingReservation) {
        throw new ConflictException(
          'Car is already reserved during this period',
        );
      }

      const newReservation = this.reservationRepository.create({
        ...createReservationDto,
        reservationDate: createReservationDto.reservationDate
          ? new Date(createReservationDto.reservationDate)
          : new Date(),
        pickupDate,
        returnDate,
      });

      return await this.reservationRepository.save(newReservation);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Error creating reservation: ' + error.message,
        500,
      );
    }
  }

  // ✅ Update reservation
  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);
    Object.assign(reservation, updateReservationDto);
    return this.reservationRepository.save(reservation);
  }

  // ✅ Delete reservation
  async remove(id: number): Promise<{ message: string }> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.delete(id);
    return { message: `Reservation #${id} deleted successfully` };
  }
}
