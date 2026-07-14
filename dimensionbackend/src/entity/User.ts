import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from "typeorm";
import { Teams } from "./Teams";
import { Issues } from "./Issue";
import { BaseCredentials } from "./Credentials";
@Entity()
export class User extends BaseCredentials {
  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  organisation: string;

  @ManyToOne(() => Teams, (team) => team.members)
  team: Relation<Teams>;

  @OneToMany(() => Teams, (team) => team.admin)
  team_administer: Teams[];

  @OneToMany(() => Issues, (issue) => issue.assignee)
  issue: Issues[];
}
