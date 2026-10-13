import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Issues } from "./entity/Issue";
import { Teams } from "./entity/Teams";
import { Projects } from "./entity/Project";
import { Credentials } from "./entity/Credentials";
import { Organisation } from "./entity/Organisation";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? "db",
  password: process.env.DB_PASSWORD ?? "test",
  database: process.env.DB_NAME ?? "dimensionbackend",
  synchronize: true,
  logging: false,
  entities: [User, Issues, Teams, Projects, Credentials, Organisation],
  migrations: [],
  subscribers: [],
});
