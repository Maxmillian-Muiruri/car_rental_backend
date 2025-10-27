import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  // ✅ Get all cars
  async findAll(): Promise<Car[]> {
    return this.carRepository.find();
  }

  // ✅ Get one car by ID
  async findOne(id: number): Promise<Car> {
    const car = await this.carRepository.findOneBy({ carId: id });
    if (!car) throw new NotFoundException(`Car with ID ${id} not found`);
    return car;
  }

  // ✅ Create new car
  async create(createCarDto: CreateCarDto): Promise<Car> {
    try {
      // Check if a car with the same model and manufacturer exists
      const existingCar = await this.carRepository.findOne({
        where: {
          carModel: createCarDto.carModel,
          manufacturer: createCarDto.manufacturer,
        },
      });

      if (existingCar) {
        throw new ConflictException('Car already exists');
      }

      const newCar = this.carRepository.create(createCarDto);
      return await this.carRepository.save(newCar);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Error creating car: ' + error.message,
        500,
      );
    }
  }

  // ✅ Update car
  async update(id: number, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.findOne(id);
    Object.assign(car, updateCarDto);
    return this.carRepository.save(car);
  }

  // ✅ Delete car
  async remove(id: number): Promise<{ message: string }> {
    const car = await this.findOne(id);
    await this.carRepository.delete(id);
    return { message: `Car '${car.carModel}' deleted successfully` };
  }
}
