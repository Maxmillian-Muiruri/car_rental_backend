import { IsInt, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateRentalDto {
  @IsInt()
  carId: number;

  @IsInt()
  customerId: number;

  @IsDateString()
  rentalStartDate: string;

  @IsDateString()
  rentalEndDate: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;
}
