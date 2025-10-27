import { IsInt, IsString, IsNumber, IsOptional, IsDateString, Length, Min } from 'class-validator';

export class CreateMaintenanceDto {
  @IsInt()
  carId: number;

  @IsOptional()
  @IsDateString()
  maintenanceDate?: string;

  @IsString()
  @Length(1, 200)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost: number;
}
