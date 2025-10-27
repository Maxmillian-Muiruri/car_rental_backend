import { IsInt, IsNumber, IsString, IsOptional, IsDateString, Min, Length, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  rentalId: number;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsString()
  @IsIn(['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'PayPal'])
  @Length(1, 50)
  paymentMethod: string;
}
