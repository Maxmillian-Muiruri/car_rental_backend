import { IsInt, IsDateString, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  carId: number;

  @IsInt()
  customerId: number;

  @IsOptional()
  @IsDateString()
  reservationDate?: string;

  @IsDateString()
  pickupDate: string;

  @IsDateString()
  returnDate: string;
}
