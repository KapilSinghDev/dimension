import { Request, Response } from "express";
import { ProjectService } from "../service/project.service";
import { issueService } from "../service/issues.service";
import jwt from "jsonwebtoken";
import { userPayloadInterface } from "../middleware/authenticate";
import authenticationService from "../service/authentication.service";

export class ProjectController {
  projectservices = new ProjectService();
  issueServices = new issueService();
  authService = new authenticationService();
  createProject = async (req: Request, res: Response) => {
    const body = req.body;
    try {
      const project = await this.projectservices.createProject(body);
      res.status(200).send({ message: project });
    } catch (err) {
      res.status(500).send({
        message: "An unknown error occured",
      });
      throw err;
    }
    return;
  };

  updateProject = async (req: Request, res: Response) => {
    const body = req.body;
    console.log("Body => ", body);
    try {
      const update = this.projectservices.updateProject(
        body.project_id,
        body.project,
      );
      res.status(200).send({ message: update });
    } catch (err) {
      res.status(500).send({
        message: "An unknown error occured",
      });
      throw err;
    }
    return;
  };

  deleteProject = async (req: Request, res: Response) => {
    const delete_id = req.query.delete_id;
    const id = Number(delete_id);
    console.log("delete project ", delete_id);
    try {
      const deleteProject = await this.projectservices.deleteProject(id);
      res.status(200).send({ message: deleteProject });
    } catch (err) {
      res.status(500).send({
        message: "An unknown error occured",
      });
      throw err;
    }
    return;
  };

  getProject = async (req: Request, res: Response) => {
    const project_ids = req.query.project_ids;
    const projects = [];
    try {
      const curr_project = await this.projectservices.searchProject(
        project_ids as string,
      );
      const project_issues = await this.issueServices.findIssuePerProject(
        Number(project_ids),
      );
      const projectResponse = { ...curr_project, issues: project_issues };
      res.status(200).send({ message: projectResponse });
    } catch (err) {
      res.status(500).send({
        message: "An unknown error occured",
      });
      throw err;
    }
  };

  getProjectbyBatch = async (req: Request, res: Response) => {
    const page = req.query.page;
    const token = req.headers.authorization?.split(" ")[1];
    const decodeToken = jwt.decode(token) as userPayloadInterface;
    try {
      const projectlist = await this.projectservices.fetchProjectByBatch(
        Number(page),
        decodeToken.user_email as string,
      );
      res.status(200).send({ projects: projectlist[0] });
    } catch (err) {
      res.status(500).send({
        message: "An unknown error occured",
      });
      throw err;
    }
  };
}
