import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  Relation,
} from "typeorm";
import { Issues } from "./Issue";
import { User } from "./User";
import { Credentials } from "./Credentials";
import { Organisation } from "./Organisation";
import { team_status_enum } from "../../enums";
@Entity()
export class Teams {
  @PrimaryGeneratedColumn("uuid")
  team_id!: string;

  @Column()
  name!: string;

  @Column({
    type: "enum",
    enum: team_status_enum,
    default: team_status_enum.ACTIVE,
  })
  status!: team_status_enum;

  @Column({ type: "varchar", nullable: true })
  timezone?: string;

  @ManyToOne(() => User, (user: User) => user.team_administer, {
    nullable: true,
  })
  admin!: User;

  @OneToMany(() => User, (user: User) => user.team, { cascade: true })
  members!: Relation<User[]>;

  @OneToMany(() => Issues, (issue) => issue.team)
  issue_assigned!: Issues[];

  @ManyToOne(() => Organisation, (orgs) => orgs.teams, { nullable: true })
  organisation: Organisation;
}
