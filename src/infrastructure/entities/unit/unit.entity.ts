import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { unitkind } from "../../data/enums/unit_kind.enum";
import { AuditableEntity } from "../../../infrastructure/base/auditable.entity";
import { Property } from "../property/property.entity";

@Entity()
export class Unit extends AuditableEntity {
  @Column({
    type: "enum",
    enum: unitkind,
    default: unitkind.APPARTMENT,
  })
  type: unitkind;

  @Column()
  url: string;

  @Column({ default: false })
  isReady: boolean;

  @Column({ nullable: true })
  deliveryDate: string;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column()
  squareFootage: number;

  @Column()
  total_price: number;

  @ManyToOne(() => Property, (property) => property.units)
  @JoinColumn({ name: "propertyId" })
  property: Property;

  @Column()
  propertyId: string;
}
