"use client";
import { projectApi } from "@/api/projectsApi";
import { useQuery } from "@tanstack/react-query";

const projectApiClient = new projectApi();

export const useGetProjects = (projectId: string) => {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects", projectId],
    queryFn: () =>
      projectApiClient.getProjects(projectId).then((res) => res.data),
    retry: 1,
  });
  return { projects, isLoading, error };
};
interface ProjectApiItem {
  id: number;
  title: string;
  description: string;
  taget_date: string;
  create_date: string;
  health: "on-track" | "at-risk" | "off-track";
  status: "backlog" | "in-progress" | "completed";
  priority: string;
}

interface ProjectBatchResponse {
  projects: ProjectApiItem[];
}

export const useGetProjectsbyBatch = (page: string) => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery<ProjectBatchResponse>({
    queryKey: ["projects-batch", page],
    queryFn: () =>
      projectApiClient.getProjectsbyBatch(page).then((res) => res.data),
    retry: false,
  });
  return { projects: response?.projects, isLoading, error };
};
