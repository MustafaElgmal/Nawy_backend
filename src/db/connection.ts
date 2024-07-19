import { Property } from "../infrastructure/entities/property/property.entity";
import { Support } from "../infrastructure/entities/support/support.entity";
import { Unit } from "../infrastructure/entities/unit/unit.entity";
import { WorkingArea } from "../infrastructure/entities/working_area/working_area.entity";
import { DataSource } from "typeorm";

export const connectionDB = () => {
  const PostgresDataSource = new DataSource({
    type: "postgres",
    host: `${process.env.DB_HOST!}`,
    port: +process.env.DB_PORT!,
    username: `${process.env.DB_USER!}`,
    password: process.env.DB_PASSWORD,
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [Support, WorkingArea, Unit, Property],
  });
  PostgresDataSource.initialize()
    .then(() => console.log("Connected to database"))
    .catch((e) => console.log(e));
};
