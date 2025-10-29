import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Rental } from '../../rental/entities/rental.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Maintenance } from '../../maintenance/entities/maintenance.entity';
import { Insurance } from '../../insurance/entities/insurance.entity';
import { Location } from '../../location/entities/location.entity';
@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn({ type: 'int' })
  carId: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  carModel: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  manufacturer: string;

  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  color: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  rentalRate: number;

  @Column({ type: 'bit', default: true })
  availability: boolean;

  // Foreign Key for Location
  @Column({ type: 'int', nullable: true })
  locationId: number;

  // Many-to-One: Many cars belong to one location
  @ManyToOne(() => Location, (location) => location.cars)
  @JoinColumn({ name: 'locationId' })
  location: Location;

  // One-to-Many relationship with Rental
  @OneToMany(() => Rental, (rental) => rental.car)
  rentals: Rental[];

  // One-to-Many relationship with Reservation
  @OneToMany(() => Reservation, (reservation) => reservation.car)
  reservations: Reservation[];

  // One-to-Many relationship with Maintenance
  @OneToMany(() => Maintenance, (maintenance) => maintenance.car)
  maintenances: Maintenance[];

  // One-to-One relationship with Insurance
  @OneToOne(() => Insurance, (insurance) => insurance.car)
  @JoinColumn()
  insurance: Insurance;
}
