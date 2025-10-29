import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/db/database.module';
import { CarModule } from './car/car.module';
import { CustomerModule } from './customer/customer.module';
import { RentalModule } from './rental/rental.module';
import { PaymentModule } from './payment/payment.module';
import { ReservationModule } from './reservation/reservation.module';
import { InsuranceModule } from './insurance/insurance.module';
import { LocationModule } from './location/location.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    CarModule,
    CustomerModule,
    RentalModule,
    PaymentModule,
    ReservationModule,
    InsuranceModule,
    LocationModule,
    MaintenanceModule,
    AuthModule,
  ],
})
export class AppModule {}
