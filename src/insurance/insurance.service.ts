import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insurance } from './entities/insurance.entity';
import { Car } from '../car/entities/car.entity';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';

@Injectable()
export class InsuranceService {
  constructor(
    @InjectRepository(Insurance)
    private readonly insuranceRepository: Repository<Insurance>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  // ✅ Get all insurance policies
  async findAll(): Promise<Insurance[]> {
    return this.insuranceRepository.find({
      relations: ['car'],
    });
  }

  // ✅ Get one insurance by ID
  async findOne(id: number): Promise<Insurance> {
    const insurance = await this.insuranceRepository.findOne({
      where: { insuranceId: id },
      relations: ['car'],
    });
    if (!insurance) throw new NotFoundException(`Insurance with ID ${id} not found`);
    return insurance;
  }

  // ✅ Create new insurance
  async create(createInsuranceDto: CreateInsuranceDto): Promise<Insurance> {
    try {
      // Validate car exists
      const car = await this.carRepository.findOne({
        where: { carId: createInsuranceDto.carId },
      });
      if (!car) {
        throw new NotFoundException('Car not found');
      }

      // Check if car already has insurance
      const existingInsurance = await this.insuranceRepository.findOne({
        where: { carId: createInsuranceDto.carId },
      });
      if (existingInsurance) {
        throw new ConflictException('Car already has insurance policy');
      }

      // Validate dates
      const startDate = new Date(createInsuranceDto.startDate);
      const endDate = new Date(createInsuranceDto.endDate);
      
      if (startDate >= endDate) {
        throw new BadRequestException('Insurance start date must be before end date');
      }

      const newInsurance = this.insuranceRepository.create({
        ...createInsuranceDto,
        startDate,
        endDate,
      });

      return await this.insuranceRepository.save(newInsurance);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Error creating insurance: ' + error.message,
        500,
      );
    }
  }

  // ✅ Update insurance
  async update(id: number, updateInsuranceDto: UpdateInsuranceDto): Promise<Insurance> {
    const insurance = await this.findOne(id);
    Object.assign(insurance, updateInsuranceDto);
    return this.insuranceRepository.save(insurance);
  }

  // ✅ Delete insurance
  async remove(id: number): Promise<{ message: string }> {
    const insurance = await this.findOne(id);
    await this.insuranceRepository.delete(id);
    return { message: `Insurance policy #${id} deleted successfully` };
  }

  // ✅ Get insurance by car ID
  async findByCarId(carId: number): Promise<Insurance> {
    const insurance = await this.insuranceRepository.findOne({
      where: { carId },
      relations: ['car'],
    });
    if (!insurance) throw new NotFoundException(`No insurance found for car ID ${carId}`);
    return insurance;
  }
}
