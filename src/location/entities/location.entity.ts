import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { Rental } from '../../rental/entities/rental.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn({ type: 'int' })
  locationId: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  locationName: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  contactNumber: string;

  // One-to-Many: One location has many cars
  @OneToMany(() => Car, (car) => car.location)
  cars: Car[];

  // One-to-Many: One location has many rentals (pickup)
  @OneToMany(() => Rental, (rental) => rental.pickupLocation)
  pickupRentals: Rental[];

  // One-to-Many: One location has many rentals (return)
  @OneToMany(() => Rental, (rental) => rental.returnLocation)
  returnRentals: Rental[];

  // One-to-Many: One location has many reservations (pickup)
  @OneToMany(() => Reservation, (reservation) => reservation.pickupLocation)
  pickupReservations: Reservation[];

  // One-to-Many: One location has many reservations (return)
  @OneToMany(() => Reservation, (reservation) => reservation.returnLocation)
  returnReservations: Reservation[];
}
