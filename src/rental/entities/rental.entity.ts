import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { Location } from '../../location/entities/location.entity';

@Entity('rental')
export class Rental {
  @PrimaryGeneratedColumn({ type: 'int' })
  rentalId: number;

  @Column({ type: 'int', nullable: false })
  carId: number;

  @Column({ type: 'int', nullable: false })
  customerId: number;

  @Column({ type: 'int', nullable: true })
  pickupLocationId: number;

  @Column({ type: 'int', nullable: true })
  returnLocationId: number;

  @ManyToOne(() => Car, (car) => car.rentals)
  @JoinColumn({ name: 'carId' })
  car: Car;

  @ManyToOne(() => Customer, (customer) => customer.rentals)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => Location, (location) => location.pickupRentals)
  @JoinColumn({ name: 'pickupLocationId' })
  pickupLocation: Location;

  @ManyToOne(() => Location, (location) => location.returnRentals)
  @JoinColumn({ name: 'returnLocationId' })
  returnLocation: Location;

  @Column({ type: 'date', nullable: false })
  rentalStartDate: Date;

  @Column({ type: 'date', nullable: false })
  rentalEndDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @OneToMany(() => Payment, (payment) => payment.rental)
  payments: Payment[];
}
