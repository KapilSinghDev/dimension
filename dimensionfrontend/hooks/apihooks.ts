"use client";
import { apiclient } from "@/api/apiClient";
import { authApi } from "@/api/authApi";
import { issueApi } from "@/api/issueApi";
import { OrganisationApi } from "@/api/organisationApi";
import { projectApi } from "@/api/projectsApi";
import { s3Api } from "@/api/s3Api";
import { teamApi } from "@/api/teamApi";
import { ProjectApiItem, ProjectBatchResponse } from "@/lib/response.types";
import {
  issueCreate_type,
  project_type,
  userCredentials_type,
  userLogin_type,
  userSignup_type,
  userUpdateProfile_type,
} from "@/lib/types";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

const projectApiClient = new projectApi();
const issueApiClient = new issueApi();
const s3ApiClient = new s3Api();
const authApiClient = new authApi();
const teamApiClient = new teamApi();
const orgApiClient = new OrganisationApi();

export const useGetUser = (email: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", email],
    queryFn: () => authApiClient.userDetail(email),
    retry: 1,
  });
  return { data, isLoading, error };
};
export const useVerifyUser = (enabled: boolean) => {
  console.log("useVerifyUser hook called");
  const { data, isLoading, error } = useQuery({
    queryKey: ["session-verify"],
    queryFn: () => {
      console.log("Fetching verifyUser", new Error().stack);
      return authApiClient.verifyUser();
    },
    enabled: enabled,
    // staleTime: 0,
    // gcTime: 0,
    // refetchOnMount: "always",
    retry: false,
  });
  return { data, isLoading, error };
};
export const useUserSignup = () => {
  return useMutation({
    mutationFn: (payload: userSignup_type) => authApiClient.userSignup(payload),
    retry: false,
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (payload: userLogin_type) => authApiClient.userLogin(payload),
    retry: false,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: (payload: userUpdateProfile_type) =>
      authApiClient.updateUser(payload),
  });
};
// project hooks
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: project_type) =>
      projectApiClient.createProject(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useUpdateProject = (project_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: project_type) =>
      projectApiClient.updateProject({
        projectId: project_id,
        project: payload,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["project"] }),
  });
};
export const useGetProjects = (projectId: string) => {
  const [projectsId] = useQueryState("project");
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<ProjectApiItem>({
    queryKey: ["project", projectId],
    queryFn: () =>
      projectApiClient.getProjects(projectId).then((res) => res.data.message),
    retry: 1,
    enabled: projectId !== "new",
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

export const useUploadToS3 = () => {
  return useMutation({
    mutationFn: ({ url, file }: { url: string; file: File }) =>
      s3ApiClient.redirectUpload(url, file, file.type),
  });
};

export const useUploadImage = () => {
  const uploadToS3 = useUploadToS3();
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await s3ApiClient.uploadMedia(file.name, file.type);
      const { url, fileKey } = res.data as { url: string; fileKey: string };

      await uploadToS3.mutateAsync({ url, file });

      return fileKey;
    },
  });
};
// team hooks
export const useGetTeamPerUser = (teamId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-team", teamId],
    queryFn: () => teamApiClient.getTeam(teamId),
  });
  return { data, isLoading, error };
};

// issue hooks

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (issue: issueCreate_type) => issueApiClient.createIssue(issue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues-batch"] });
    },
  });
};

//organisation hooks

export const useGetAllOrganisations = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["organisations"],
    queryFn: () => orgApiClient.getAllOrganisations(),
  });
  return { data, isLoading, error };
};
