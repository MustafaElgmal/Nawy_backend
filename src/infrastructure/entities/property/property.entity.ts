import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { AuditableEntity } from "../../../infrastructure/base/auditable.entity";
import { unitkind } from "../../data/enums/unit_kind.enum";
import { Unit } from "../unit/unit.entity";
import { WorkingArea } from "../working_area/working_area.entity";
@Entity()
export class Property extends AuditableEntity {
  @Column({ unique: true })
  name: string;
  @Column()
  owner: string;
  @Column()
  coverUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  downPaymentPercentage:number;
  @Column()
  numberOfYear: number;

  @OneToMany(() => Unit, (unit) => unit.property, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  units: Unit[];

  @ManyToOne(() => WorkingArea, (working_area) => working_area.properties)
  @JoinColumn({ name: "working_areaId" })
  working_area: WorkingArea;

  @Column()
  working_areaId: string;
}
