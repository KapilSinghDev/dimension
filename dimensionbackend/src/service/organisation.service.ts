import { AppDataSource } from "../data-source";
import { Organisation } from "../entity/Organisation";
import {
  CreateOrganisationDto,
  UpdateOrganisationDto,
} from "../dto/organisation_dto";

export class OrganisationService {
  private orgRepository = AppDataSource.getRepository(Organisation);

  async getAllOrganisations(): Promise<Organisation[]> {
    return await this.orgRepository.find({
      relations: ["projects", "teams"],
    });
  }

  async getOrganisationById(
    organisationId: number,
  ): Promise<Organisation | null> {
    return await this.orgRepository.findOne({
      where: { organisationId },
      relations: ["projects", "issues", "users", "teams"],
    });
  }

  async createOrganisation(data: CreateOrganisationDto): Promise<Organisation> {
    const newOrg = this.orgRepository.create(data);
    return await this.orgRepository.save(newOrg);
  }

  async updateOrganisation(
    organisationId: number,
    data: UpdateOrganisationDto,
  ): Promise<Organisation | null> {
    const org = await this.orgRepository.findOneBy({ organisationId });

    if (!org) {
      return null;
    }

    // Merge updated fields into existing entity instance
    this.orgRepository.merge(org, data);
    return await this.orgRepository.save(org);
  }

  async deleteOrganisation(organisationId: number): Promise<boolean> {
    const result = await this.orgRepository.delete(organisationId);
    return (result.affected ?? 0) > 0;
  }
}
