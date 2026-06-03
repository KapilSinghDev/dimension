import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { issue_status_enum, priority_enum } from "../../enums";
import { Teams } from "./Teams";
import { User } from "./User";

@Entity()
export class Issues {
  @PrimaryGeneratedColumn()
  issue_id: number;

  @Column()
  title: string;

  @Column()
  created_at: Date;

  @Column()
  created_by: number;

  @ManyToOne(() => User, (user) => user.issue, { nullable: true })
  assignee: User;

  @ManyToOne(() => Teams, (teams) => teams.issue_assigned, { nullable: true })
  team: Teams;

  @Column()
  deadline: Date;

  @Column({
    type: "enum",
    enum: priority_enum,
    default: priority_enum.MEDIUM,
  })
  priority: priority_enum;

  @Column({
    type: "enum",
    enum: issue_status_enum,
    default: issue_status_enum.ACTIVE,
  })
  status: issue_status_enum;
}
