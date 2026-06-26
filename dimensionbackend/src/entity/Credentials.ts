import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

export class BaseCredentials {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: Date;
}
@Entity()
export class Credentials extends BaseCredentials {
  @Column()
  password: string;
}
