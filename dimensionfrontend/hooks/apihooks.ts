"use client";
import { issueApi } from "@/api/issueApi";
import { projectApi } from "@/api/projectsApi";
import { ProjectApiItem, ProjectBatchResponse } from "@/lib/response.types";
import { useQuery } from "@tanstack/react-query";

const projectApiClient = new projectApi();
const issueApiClient = new issueApi();

export const useGetProjects = (projectId: string) => {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<ProjectApiItem>({
    queryKey: ["projects", projectId],
    queryFn: () =>
      projectApiClient.getProjects(projectId).then((res) => res.data.message),
    retry: 1,
  });
  return { projects, isLoading, error };
};

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

export const useGetIssues = (page: string) => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["issues-batch", page],
    queryFn: () =>
      issueApiClient.getAllIssues().then((response) => response.data),
    retry: false,
  });
  return { data: response?.message, isLoading, error };
};

export const useGetSingleIssue = (issueId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: () =>
      issueApiClient.getIssue({ issueId }).then((res) => res.data.message),
    retry: false,
  });
  return { data, isLoading, error };
};
