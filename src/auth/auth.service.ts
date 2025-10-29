import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../customer/entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateAuthDto, SignUpDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  private async saveRefreshToken(customerId: number, refreshToken: string) {
    const hashedToken = await this.hashData(refreshToken);
    await this.customerRepository.update(customerId, {
      hashedRefreshToken: hashedToken,
    });
  }

  private generateTokens(customerId: number, email: string, role: string) {
    const accessToken = this.jwtService.sign(
      { sub: customerId, email: email, role: role },
      {
        secret: this.configService.getOrThrow<string>(
          'JWT_ACCESS_TOKEN_SECRET',
        ),
        expiresIn: '2h',
      },
    );
    const refreshToken = this.jwtService.sign(
      { sub: customerId, email: email, role: role },
      {
        secret: this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_SECRET',
        ),
        expiresIn: '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  async signUp(signUpDto: SignUpDto) {
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: signUpDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashData(signUpDto.password);

    const customer = this.customerRepository.create({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: signUpDto.email,
      phoneNumber: signUpDto.phoneNumber,
      address: signUpDto.address,
      password: hashedPassword,
      hashedRefreshToken: '',
    });

    // Generate tokens
    const savedCustomer = await this.customerRepository.save(customer);
    const { accessToken, refreshToken } = this.generateTokens(
      savedCustomer.customerId,
      savedCustomer.email,
      savedCustomer.role,
    );

    await this.saveRefreshToken(savedCustomer.customerId, refreshToken);

    // Return customer without password
    const { password, hashedRefreshToken, ...customerWithoutPassword } =
      savedCustomer;

    return {
      customer: customerWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async signIn(createAuthDto: CreateAuthDto) {
    const foundCustomer = await this.customerRepository.findOne({
      where: { email: createAuthDto.email },
      select: [
        'email',
        'customerId',
        'role',
        'password',
        'firstName',
        'lastName',
      ],
    });

    if (!foundCustomer) {
      throw new NotFoundException('Customer with that email not found');
    }

    const isPasswordValid = await bcrypt.compare(
      createAuthDto.password,
      foundCustomer.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { accessToken, refreshToken } = this.generateTokens(
      foundCustomer.customerId,
      foundCustomer.email,
      foundCustomer.role,
    );

    await this.saveRefreshToken(foundCustomer.customerId, refreshToken);

    const { password, ...customerWithoutPassword } = foundCustomer;

    return {
      customer: customerWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async signOut(customerId: number) {
    const res = await this.customerRepository.update(customerId, {
      hashedRefreshToken: null,
    });

    if (res.affected === 0) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }

    return { message: `Customer with id ${customerId} signed out` };
  }
}
