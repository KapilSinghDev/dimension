import { AppDataSource } from "@/data-source";
import { Resources } from "@/entity/Resource";
import { UUID } from "node:crypto";

export class ResourceServices {
  resourceRepository = AppDataSource.getRepository(Resources);

  createResource = async (
    data: {
      resource_name: string;
      resource_content?: string;
      resource_image?: string;
      project_id: string;
    },
    user_id: number,
  ) => {
    const { project_id, ...restData } = data;

    const resource = this.resourceRepository.create({
      ...restData,
      resource_made_by: { user_id: user_id },
      resource_for: {
        id: Number(project_id),
      } as any,
    });

    return await this.resourceRepository.save(resource);
  };

  fetchResource = async (id: UUID) => {
    try {
      const document = await this.resourceRepository.findOneBy({
        resource_id: id,
      });
      return document;
    } catch (err) {
      throw err;
    }
  };

  updateResource = async (
    id: UUID,
    updates: Partial<
      Pick<Resources, "resource_name" | "resource_content" | "resource_image">
    >,
  ) => {
    const resource = await this.resourceRepository.findOneBy({
      resource_id: id,
    });

    if (!resource) {
      return null;
    }

    this.resourceRepository.merge(resource, updates);
    return await this.resourceRepository.save(resource);
  };

  deleteResource = async (id: UUID): Promise<boolean> => {
    const result = await this.resourceRepository.delete({ resource_id: id });
    return (result.affected ?? 0) > 0;
  };

  fetchResourceByBatch = async (user_id: string, project_id: string) => {
    const documentlist = await this.resourceRepository.find({
      where: {
        resource_made_by: {
          user_id: Number(user_id),
        },
        resource_for: {
          id: Number(project_id),
        } as any,
      },
      relations: {
        resource_made_by: true,
        resource_for: true,
      },
    });
    return documentlist;
  };
}
