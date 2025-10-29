import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // ✅ Get all locations
  async findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  // ✅ Get one location by ID
  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOneBy({
      locationId: id,
    });
    if (!location)
      throw new NotFoundException(`Location with ID ${id} not found`);
    return location;
  }

  // ✅ Create new location
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    try {
      // Check if a location with the same name exists
      const existingLocation = await this.locationRepository.findOne({
        where: { locationName: createLocationDto.locationName },
      });

      if (existingLocation) {
        throw new ConflictException('Location with this name already exists');
      }

      const newLocation = this.locationRepository.create(createLocationDto);
      return await this.locationRepository.save(newLocation);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException('Error creating location: ' + error.message, 500);
    }
  }

  // ✅ Update location
  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);
    Object.assign(location, updateLocationDto);
    return this.locationRepository.save(location);
  }

  // ✅ Delete location
  async remove(id: number): Promise<{ message: string }> {
    const location = await this.findOne(id);
    await this.locationRepository.delete(id);
    return {
      message: `Location '${location.locationName}' deleted successfully`,
    };
  }
}
