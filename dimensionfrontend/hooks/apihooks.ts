import { projectApi } from "@/api/projectsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const projectApiClient = new projectApi();

// READ — fetch all projects
export const useGetProjects = (projectId: string[]) => {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects", projectId],
    queryFn: () =>
      projectApiClient.getProjects(projectId).then((res) => res.data),
  });
  return { projects, isLoading, error };
};
