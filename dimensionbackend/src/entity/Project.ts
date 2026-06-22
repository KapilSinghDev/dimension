import { Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import {
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "../../enums";

export class Projects {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  create_date: Date;

  @Column()
  taget_date: Date;

  @Column()
  health: project_health_enum;

  @Column()
  status: project_status_enum; // to be converted to enums

  @Column()
  priority: project_priority_enum; // to be converted to enum
}
