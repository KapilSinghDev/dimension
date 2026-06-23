import {
  Column,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "../../enums";
import { Issues } from "./Issue";

export class Projects {
  @PrimaryGeneratedColumn()
  @OneToMany(() => Issues, (issues) => issues.issue_id)
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  create_date: Date;

  @Column()
  taget_date: Date;

  @Column()
  health: project_health_enum;

  @Column()
  status: project_status_enum;

  @Column()
  priority: project_priority_enum;

  @OneToMany(() => Issues, (issue) => issue.issue_id, { nullable: true })
  issues: Issues[];
}
