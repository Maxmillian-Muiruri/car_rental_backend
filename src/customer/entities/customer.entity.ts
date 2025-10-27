import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rental } from '../../rental/entities/rental.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  customerId: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 20 })
  phoneNumber: string;

  @Column({ length: 200 })
  address: string;

  // One-to-Many relationship with Rental
  @OneToMany(() => Rental, rental => rental.customer)
  rentals: Rental[];

  // One-to-Many relationship with Reservation
  @OneToMany(() => Reservation, reservation => reservation.customer)
  reservations: Reservation[];
}
