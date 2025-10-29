import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Car } from '../../car/entities/car.entity';

@Entity('maintenance')
export class Maintenance {
  @PrimaryGeneratedColumn({ type: 'int' })
  maintenanceId: number;
  @Column({ type: 'int', nullable: false })
  carId: number;

  @ManyToOne(() => Car, (car) => car.maintenances)
  @JoinColumn({ name: 'carId' })
  car: Car;

  @Column({ type: 'date', default: () => 'GETDATE()', nullable: false })
  maintenanceDate: Date;

  @Column({ type: 'varchar', length: 200, nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  cost: number;
}
