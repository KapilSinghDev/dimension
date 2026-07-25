import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import {
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "../../enums";
import { Issues } from "./Issue";
import { User } from "./User";

@Entity()
export class Projects {
  @PrimaryGeneratedColumn()
  // @OneToMany(() => Issues, (issues) => issues.issue_id)
  id!: number;

  @Column()
  title!: string;

  @OneToMany(() => User, (user) => user.email)
  created_by: Relation<User>;

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn({ type: "timestamp" }) // Automatically captures exact date + time
  create_date!: Date;

  @CreateDateColumn({ type: "timestamp" })
  taget_date!: Date;

  @Column()
  health!: project_health_enum;

  @Column()
  status!: project_status_enum;

  @Column()
  priority!: project_priority_enum;

  @OneToMany(() => Issues, (issue) => issue.project, {
    nullable: true,
    cascade: true,
  })
  issues!: Issues[];
}
