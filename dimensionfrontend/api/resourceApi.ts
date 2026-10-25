import { apiclient } from "./apiClient";
import { UpdateResourcePayload } from "@/lib/types";
export class resourceApi {
  private getAuthHeaders() {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("TOKEN") : null;

    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  createResource = (payload: UpdateResourcePayload) => {
    return apiclient.post(`/resource/`, payload, {
      headers: this.getAuthHeaders(),
    });
  };

  getResource = (id: string) => {
    return apiclient.get(`/resource/?id=${id}`, {
      headers: this.getAuthHeaders(),
    });
  };

  updateResource = (id: string, payload: UpdateResourcePayload) => {
    return apiclient.patch(`/resource/${id}`, payload, {
      headers: this.getAuthHeaders(),
    });
  };

  deleteResource = (id: string) => {
    return apiclient.delete(`/resource/${id}`, {
      headers: this.getAuthHeaders(),
    });
  };

  getResourceBatch = (page: string) => {
    return apiclient.get(`/resource/batch?page=${page}`, {
      headers: this.getAuthHeaders(),
    });
  };
}
