import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Car } from '../../car/entities/car.entity';

@Entity('insurance')
export class Insurance {
  @PrimaryGeneratedColumn({ type: 'int' })
  insuranceId: number;

  @Column({ type: 'int', nullable: false })
  carId: number;

  @OneToOne(() => Car, (car) => car.insurance)
  @JoinColumn({ name: 'carId' })
  car: Car;

  @Column({ type: 'varchar', length: 100, nullable: false })
  insuranceProvider: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  policyNumber: string;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: false })
  endDate: Date; // date
}
