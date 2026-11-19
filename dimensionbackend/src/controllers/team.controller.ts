import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { userPayloadInterface } from "../middleware/authenticate";
import { teamService } from "../service/team.service";
export class teamController {
  private teamService = new teamService();

  createNewTeam = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { user_id } = jwt.decode(token as string) as userPayloadInterface;
      const createTeam = await this.teamService.createTeam(req.body, user_id);
      res.send({ response: createTeam }).status(201);
    } catch (err) {
      console.error("Error occured", err);
      res.send({ message: "An error occured" }).status(500);
    }
  };

  updateTeam = async (req: Request, res: Response) => {
    try {
      const updateResult = await this.teamService.updateTeam(
        req.body,
        req.params.id.toString(),
      );
      res.send({ response: updateResult }).status(201);
    } catch (err) {
      console.error("An unknow error occured", err);
      res.send({ message: "An unknown error occured" }).status(500);
    }
  };

  getTeam = async (req: Request, res: Response) => {
    try {
      const team = await this.teamService.findTeam(
        req.params.id.toString() || null,
      );
      res.send({ response: team }).status(201);
    } catch (err) {
      console.error("An error occured", err);
      res.send({ message: "An error occured" }).status(500);
    }
  };

  getAllTeams = async (req: Request, res: Response) => {
    try {
      const team = await this.teamService.findallTeams();
      res.send({ response: team }).status(201);
    } catch (err) {
      console.error(err);
      res.send({ message: "Error occured" }).status(500);
    }
  };

  deleteTeam = async (req: Request, res: Response) => {
    try {
      const deleteTeam = await this.teamService.deleteTeam(
        req.params.id.toString(),
      );
      res.send({ response: deleteTeam }).status(201);
    } catch (err) {
      console.error("An error occured", err);
      res.send({ message: "An error occured" }).status(500);
    }
  };
}
