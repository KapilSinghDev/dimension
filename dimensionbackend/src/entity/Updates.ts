import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Issues } from "@/entity/Issue";
import { User } from "./User";

@Entity()
export class Updates {
  @PrimaryGeneratedColumn()
  update_id: string;

  @UpdateDateColumn({ type: "timestamp" })
  update_time: Date;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "CASCADE",
    nullable: true,
  })
  updated_by: User;

  @Column()
  update_comment: string;

  @Column({ nullable: true })
  update_asset: string;

  @ManyToOne(() => Issues, (issue) => issue.issue_updates, {
    onDelete: "CASCADE",
    nullable: true,
  })
  issues: Issues;
}
