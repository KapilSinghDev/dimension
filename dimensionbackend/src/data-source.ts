import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Issues } from "./entity/Issue";
import { Teams } from "./entity/Teams";
import { Projects } from "./entity/Project";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "db",
  password: "test",
  database: "dimensionbackend",
  synchronize: true,
  logging: false,
  entities: [User, Issues, Teams, Projects],
  migrations: [],
  subscribers: [],
});
