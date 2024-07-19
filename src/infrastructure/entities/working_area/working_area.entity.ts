import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { AuditableEntity } from "../../../infrastructure/base/auditable.entity";
import { Property } from "../property/property.entity";
@Entity()
export class WorkingArea extends AuditableEntity {
  @Column({ unique: true })
  name: string;
  @Column()
  description: string;
  @Column()
  url: string;
  @OneToMany(() => Property, (property) => property.working_area)
  properties: Property[];
}
