import { IsString, IsInt, IsNumber, IsBoolean, Min, Max, IsOptional, Length } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @Length(1, 100)
  carModel: string;

  @IsString()
  @Length(1, 100)
  manufacturer: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsString()
  @Length(1, 50)
  color: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  rentalRate: number;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;
}
