import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { Location } from '../../location/entities/location.entity';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn({ type: 'int' })
  reservationId: number;
  @Column({ type: 'int', nullable: false })
  carId: number;

  @Column({ type: 'int', nullable: false })
  customerId: number;
  @Column({ type: 'int', nullable: true })
  pickupLocationId: number;

  @Column({ type: 'int', nullable: true })
  returnLocationId: number;

  @ManyToOne(() => Car, (car) => car.reservations)
  @JoinColumn({ name: 'carId' })
  car: Car;

  @ManyToOne(() => Customer, (customer) => customer.reservations)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => Location, (location) => location.pickupReservations)
  @JoinColumn({ name: 'pickupLocationId' })
  pickupLocation: Location;

  @ManyToOne(() => Location, (location) => location.returnReservations)
  @JoinColumn({ name: 'returnLocationId' })
  returnLocation: Location;

  @Column({ type: 'date', default: () => 'GETDATE()', nullable: false })
  reservationDate: Date;

  @Column({ type: 'date', nullable: false })
  pickupDate: Date;

  @Column({ type: 'date', nullable: false })
  returnDate: Date;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'Pending' })
  status: string;
}
