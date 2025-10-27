import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // ✅ Get all customers
  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      relations: ['rentals', 'reservations'],
    });
  }

  // ✅ Get one customer by ID
  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customerId: id },
      relations: ['rentals', 'reservations'],
    });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);
    return customer;
  }

  // ✅ Create new customer
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      // Check if a customer with the same email exists
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: createCustomerDto.email },
      });

      if (existingCustomer) {
        throw new ConflictException('Customer with this email already exists');
      }

      const newCustomer = this.customerRepository.create(createCustomerDto);
      return await this.customerRepository.save(newCustomer);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Error creating customer: ' + error.message,
        500,
      );
    }
  }

  // ✅ Update customer
  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  // ✅ Delete customer
  async remove(id: number): Promise<{ message: string }> {
    const customer = await this.findOne(id);
    await this.customerRepository.delete(id);
    return { message: `Customer '${customer.firstName} ${customer.lastName}' deleted successfully` };
  }
}
