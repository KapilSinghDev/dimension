import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Issues } from "./Issue";
import { User } from "./User";
import { Credentials } from './Credentials'
@Entity()
export class Teams {
  @PrimaryGeneratedColumn()
  team_id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.team_administer, { nullable: true })
  admin: User;

  @OneToMany(() => User, (user) => user.team)
  members: User[];

  @OneToMany(() => Issues, (issue) => issue.team)
  issue_assigned: Issues[];
}
