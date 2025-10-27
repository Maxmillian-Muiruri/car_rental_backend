import { IsString, IsEmail, IsOptional, Length, Matches } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @Length(1, 50)
  firstName: string;

  @IsString()
  @Length(1, 50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Invalid phone number format' })
  phoneNumber: string;

  @IsString()
  @Length(1, 200)
  address: string;
}
