import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Car } from '../../car/entities/car.entity';

@Entity()
export class Insurance {
  @PrimaryGeneratedColumn()
  insuranceId: number;

  @Column()
  carId: number;

  @OneToOne(() => Car, car => car.insurance)
  @JoinColumn({ name: 'carId' })
  car: Car;

  @Column({ length: 100 })
  insuranceProvider: string;

  @Column({ length: 50 })
  policyNumber: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;
}
