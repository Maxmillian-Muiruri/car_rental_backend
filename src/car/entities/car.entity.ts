import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Rental } from '../../rental/entities/rental.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Maintenance } from '../../maintenance/entities/maintenance.entity';
import { Insurance } from '../../insurance/entities/insurance.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  carId: number;

  @Column({ length: 100 })
  carModel: string;

  @Column({ length: 100 })
  manufacturer: string;

  @Column()
  year: number;

  @Column({ length: 50 })
  color: string;

  @Column('decimal', { precision: 10, scale: 2 })
  rentalRate: number;

  @Column({ default: true })
  availability: boolean;

  // One-to-Many relationship with Rental
  @OneToMany(() => Rental, rental => rental.car)
  rentals: Rental[];

  // One-to-Many relationship with Reservation
  @OneToMany(() => Reservation, reservation => reservation.car)
  reservations: Reservation[];

  // One-to-Many relationship with Maintenance
  @OneToMany(() => Maintenance, maintenance => maintenance.car)
  maintenances: Maintenance[];

  // One-to-One relationship with Insurance
  @OneToOne(() => Insurance, insurance => insurance.car)
  @JoinColumn()
  insurance: Insurance;
}
