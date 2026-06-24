import * as dotenv from "dotenv";
dotenv.config();
import * as express from "express";
import { AppDataSource } from "./data-source";
import { json } from "express";
import { authRoutes } from "./routes/authroutes";
import { issueRouter } from "./routes/issueroutes";
import { teamRoute } from "./routes/teamroutes";
import { Projectroutes } from "./routes/projectroutes";
const PORT = 3000;
AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(json());
    const routes_user = new authRoutes();
    app.use(routes_user.publishAuthRoutes());
    const routes_issue = new issueRouter();
    app.use(routes_issue.publishIssueRouter());
    const routes_team = new teamRoute();
    app.use(routes_team.publishTeamRoutes());
    const routes_projects = new Projectroutes();
    app.use(routes_projects.publishProjectRoutes());

    const dimension_app_router = express.Router();
    dimension_app_router.use(routes_user.publishAuthRoutes());
    dimension_app_router.use(routes_issue.publishIssueRouter());
    dimension_app_router.use(routes_team.publishTeamRoutes());
    dimension_app_router.use(routes_projects.publishProjectRoutes());

    dimension_app_router.get("/", (req, res) => {
      res.send("Dimension backend running");
    });
    app.use("/dimension/api", dimension_app_router);
    app.listen(PORT, () => {
      console.log("Dimension app running on port ", PORT);
    });
  })
  .catch((error) => console.log(error));
