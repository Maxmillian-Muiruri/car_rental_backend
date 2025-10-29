import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rental } from '../../rental/entities/rental.entity';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn({ type: 'int' })
  paymentId: number;

  @Column({ type: 'int', nullable: false })
  rentalId: number;

  @ManyToOne(() => Rental, (rental) => rental.payments)
  @JoinColumn({ name: 'rentalId' })
  rental: Rental;

  @Column({ type: 'date', default: () => 'GETDATE()', nullable: false })
  paymentDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  paymentMethod: string;
}
