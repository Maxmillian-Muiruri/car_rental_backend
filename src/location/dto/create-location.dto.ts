import { IsString, Length, Matches } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @Length(1, 100)
  locationName: string;

  @IsString()
  @Length(1, 200)
  address: string;

  @IsString()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, {
    message: 'Invalid contact number format',
  })
  contactNumber: string;
}
