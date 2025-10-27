import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Car } from '../../car/entities/car.entity';

@Entity()
export class Maintenance {
  @PrimaryGeneratedColumn()
  maintenanceId: number;

  @Column()
  carId: number;

  @ManyToOne(() => Car, car => car.maintenances)
  @JoinColumn({ name: 'carId' })
  car: Car;

  @Column({ type: 'date', default: () => 'GETDATE()' })
  maintenanceDate: Date;

  @Column({ length: 200 })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;
}
