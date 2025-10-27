import { IsInt, IsString, IsDateString, Length } from 'class-validator';

export class CreateInsuranceDto {
  @IsInt()
  carId: number;

  @IsString()
  @Length(1, 100)
  insuranceProvider: string;

  @IsString()
  @Length(1, 50)
  policyNumber: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
