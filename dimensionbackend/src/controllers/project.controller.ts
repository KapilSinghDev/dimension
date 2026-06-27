import { Request, Response } from "express";
import { ProjectService } from "../service/project.service";

export class ProjectController {
  projectservices = new ProjectService();

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
    const project_ids = req.body;
    const projects = [];
    try {
      project_ids.forEach((id) => {
        const curr_project = this.projectservices.searchProject(id);
        projects.push(curr_project);
        res.status(200).send({ message: projects });
      });
    } catch (err) {
      res.status(500).send({
        message: "An unknown error occured",
      });
      throw err;
    }
  };
}
