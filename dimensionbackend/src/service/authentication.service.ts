import { AppDataSource } from "../data-source";
import {
  search_user_dto,
  update_profile_dto,
  user_credentials_dto_type,
  user_dto,
  user_dto_type,
  user_login_dto_type,
  user_profile_dto_type,
} from "../dto/user_dto";
import * as bcrypt from "bcrypt";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import { issue_dto_type } from "../dto/issue_dto";
import { Issues } from "../entity/Issue";
import { validate } from "../decorators/validator.decorator";
import { Credentials } from "../entity/Credentials";
import { s3ServiceClient } from "./s3.service";
// import Multer from "multer";
import * as multer from "multer";
class authenticationService {
  private userRepository = AppDataSource.getRepository(User);
  private issueRepository = AppDataSource.getRepository(Issues);
  private credentialsRepository = AppDataSource.getRepository(Credentials);
  salt_rounds = 10;
  SECRET_KEY = process.env.SECRET_KEY;
  s3Service = new s3ServiceClient();
  async searchUser(user_email: string) {
    const existingUser = await this.userRepository.findOneBy({
      email: user_email,
    });

    return existingUser;
  }

  async generateToken(user_email: string) {
    const token = jwt.sign({ user_email }, this.SECRET_KEY, {
      expiresIn: "720h",
    });
    return token;
  }

  async createAndSaveUser(
    member: user_credentials_dto_type,
    file?: Express.Multer.File,
  ) {
    const existingUser = await this.searchUser(member.email);
    if (!existingUser) {
      const blob = file;
      let image_url;

      if (blob) {
        const image_response = await this.s3Service.uploadObject(
          blob.buffer,
          `${member.firstname}.jpg`,
          blob.mimetype,
        );
        image_url = image_response.fileKey;
      }

      const hashpassword = await bcrypt.hash(member.password, this.salt_rounds);
      member.password = hashpassword;
      const newUser = await this.credentialsRepository.save(member);
      const savedUser = await this.userRepository.save({
        ...newUser,
        picture: image_url,
      });
      const token = this.generateToken(newUser.email);
      return token;
    }
    return null;
  }

  async verifyUser(login_member: user_login_dto_type) {
    const existingUser = await this.credentialsRepository.findOneBy({
      email: login_member.email,
    });
    if (existingUser) {
      const verified = await bcrypt.compare(
        login_member.password,
        existingUser.password,
      );
      return verified;
    }
    return false;
  }
  @validate(update_profile_dto)
  async updateUserProfile(
    user_email: string,
    role?: string,
    organisation?: string,
  ) {
    const profile = await this.credentialsRepository.findOneBy({
      email: user_email,
    });
    const profileUpdate = this.userRepository.create({
      ...profile,
      role: role || null,
      organisation: organisation || null,
    });
    const update = await this.userRepository.save(profileUpdate);
    return update;
  }
  @validate(search_user_dto)
  async getUserIssues(user_email: string) {
    const userIssues = await this.issueRepository
      .createQueryBuilder("Issues")
      .leftJoin("Issues.assignee", "assignee")
      .where("assignee.email = :email", { email: user_email })
      .getMany();
    return userIssues;
  }
}

export default authenticationService;
