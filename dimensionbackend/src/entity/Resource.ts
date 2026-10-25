import { UUID } from "node:crypto";
import {
  Column,
  CreateDateColumn,
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

  @CreateDateColumn({ type: "timestamp" })
  resource_created_on: Date;

  @ManyToOne(() => Projects, (projects) => projects.resources)
  resource_for: Projects[];

  @Column({ nullable: true })
  resource_image: string;

  @ManyToOne(() => User, (user) => user.attachments)
  resource_made_by: User;
}
