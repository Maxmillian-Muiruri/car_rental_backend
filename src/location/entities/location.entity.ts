import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  locationId: number;

  @Column({ length: 100 })
  locationName: string;

  @Column({ length: 200 })
  address: string;

  @Column({ length: 20 })
  contactNumber: string;
}
