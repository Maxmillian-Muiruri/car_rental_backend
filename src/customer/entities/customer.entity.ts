import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rental } from '../../rental/entities/rental.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

export enum CustomerRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn({ type: 'int' })
  customerId: number;
  @Column({ type: 'varchar', length: 50, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  address: string;

  // Authentication fields
  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  password: string; // hashed password

  @Column({
    type: 'varchar',
    length: 20,
    default: CustomerRole.CUSTOMER,
    nullable: false,
  })
  role: CustomerRole; // customer or admin

  @Column({ type: 'varchar', length: 500, nullable: true, select: false })
  hashedRefreshToken: string | null; // for refresh token

  // One-to-Many relationship with Rental
  @OneToMany(() => Rental, (rental) => rental.customer)
  rentals: Rental[];

  // One-to-Many relationship with Reservation
  @OneToMany(() => Reservation, (reservation) => reservation.customer)
  reservations: Reservation[];
}
