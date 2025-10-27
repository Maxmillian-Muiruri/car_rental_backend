import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  rentalId: number;

  @Column()
  carId: number;

  @Column()
  customerId: number;

  @ManyToOne(() => Car, car => car.rentals)
  @JoinColumn({ name: 'carId' })
  car: Car;

  @ManyToOne(() => Customer, customer => customer.rentals)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ type: 'date' })
  rentalStartDate: Date;

  @Column({ type: 'date' })
  rentalEndDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  // One-to-Many relationship with Payment
  @OneToMany(() => Payment, payment => payment.rental)
  payments: Payment[];
}
