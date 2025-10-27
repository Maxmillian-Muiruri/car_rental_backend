import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { Car } from '../car/entities/car.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenanceRepository: Repository<Maintenance>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  // ✅ Get all maintenance records
  async findAll(): Promise<Maintenance[]> {
    return this.maintenanceRepository.find({
      relations: ['car'],
    });
  }

  // ✅ Get one maintenance by ID
  async findOne(id: number): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { maintenanceId: id },
      relations: ['car'],
    });
    if (!maintenance) throw new NotFoundException(`Maintenance with ID ${id} not found`);
    return maintenance;
  }

  // ✅ Create new maintenance
  async create(createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
    try {
      // Validate car exists
      const car = await this.carRepository.findOne({
        where: { carId: createMaintenanceDto.carId },
      });
      if (!car) {
        throw new NotFoundException('Car not found');
      }

      const newMaintenance = this.maintenanceRepository.create({
        ...createMaintenanceDto,
        maintenanceDate: createMaintenanceDto.maintenanceDate ? new Date(createMaintenanceDto.maintenanceDate) : new Date(),
      });

      return await this.maintenanceRepository.save(newMaintenance);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Error creating maintenance record: ' + error.message,
        500,
      );
    }
  }

  // ✅ Update maintenance
  async update(id: number, updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance> {
    const maintenance = await this.findOne(id);
    Object.assign(maintenance, updateMaintenanceDto);
    return this.maintenanceRepository.save(maintenance);
  }

  // ✅ Delete maintenance
  async remove(id: number): Promise<{ message: string }> {
    const maintenance = await this.findOne(id);
    await this.maintenanceRepository.delete(id);
    return { message: `Maintenance record #${id} deleted successfully` };
  }

  // ✅ Get maintenance by car ID
  async findByCarId(carId: number): Promise<Maintenance[]> {
    return this.maintenanceRepository.find({
      where: { carId },
      relations: ['car'],
    });
  }
}
