import { project_type } from "@/lib/types";
import { apiclient } from "./apiClient";

export class projectApi {
  createProject(payload: project_type) {
    return apiclient.post("/project/create", payload);
  }

  updateProject(payload: { projectId: string; project: project_type }) {
    return apiclient.put("/project/update", payload);
  }

  deleteProject(payload: string) {
    return apiclient.delete("/project/delete", {
      params: {
        payload,
      },
    });
  }

  getProjects(project_ids: string[]) {
    return apiclient.get("/project/batch-get", {
      params: {
        project_ids,
      },
    });
  }
}
