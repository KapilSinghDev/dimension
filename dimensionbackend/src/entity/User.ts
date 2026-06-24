import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Teams } from "./Teams";
import { Issues } from "./Issue";
import { Credentials } from "./Credentials";
@Entity()
export class User extends Credentials {
  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  organisation: string;

  @ManyToOne(() => Teams, (team) => team.members)
  team: Teams;

  @ManyToOne(() => Teams, (team) => team.admin)
  team_administer: Teams[];

  @OneToMany(() => Issues, (issue) => issue.assignee)
  issue: Issues[];
}
