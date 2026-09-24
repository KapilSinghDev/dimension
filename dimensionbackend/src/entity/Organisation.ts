import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Projects } from "./Project";
import { Issues } from "./Issue";
import { User } from "./User";
import { Teams } from "./Teams";

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn()
  organisationId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "timestamp" })
  joining_date: Date;

  @OneToMany(() => Projects, (projects) => projects.organisation)
  projects: Projects[];

  @OneToMany(() => Issues, (issue) => issue.organisation)
  issues: Issues[];

  @OneToMany(() => User, (users) => users.organisation)
  users: User[];

  @OneToMany(() => Teams, (teams) => teams.organisation)
  teams: Teams[];
}
