import { UUID } from "node:crypto";
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Projects } from "./Project";
import { User } from "./User";

@Entity()
export class Resources {
  @PrimaryGeneratedColumn("uuid")
  resource_id: string;

  @Column()
  resource_name: string;

  @Column()
  resource_content: string;

  @ManyToOne(() => Projects, (projects) => projects.resources)
  resource_for: string;

  @Column({ nullable: true })
  resource_image: string;

  @ManyToOne(() => User)
  resource_made_by: User;
}
