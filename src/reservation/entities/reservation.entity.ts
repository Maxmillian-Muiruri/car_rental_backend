import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { Customer } from '../../customer/entities/customer.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  reservationId: number;

  @Column()
  carId: number;

  @Column()
  customerId: number;

  @ManyToOne(() => Car, car => car.reservations)
  @JoinColumn({ name: 'carId' })
  car: Car;

  @ManyToOne(() => Customer, customer => customer.reservations)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ type: 'date', default: () => 'GETDATE()' })
  reservationDate: Date;

  @Column({ type: 'date' })
  pickupDate: Date;

  @Column({ type: 'date' })
  returnDate: Date;
}
