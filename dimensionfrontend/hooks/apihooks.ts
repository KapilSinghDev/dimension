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
