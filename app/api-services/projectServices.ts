import axios from "axios";
import { UUID } from "crypto";
import { TeamRole } from "./teamRolesServices";
import { User } from "./userService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface Project {
  id: UUID;
  projectName: string;
  projectPeriod: string;
  startDate: string;
  deadlineDate: string;
  projectStatus: string;
  generalDescription: string;
  technologyStack: TechnologyStack[];
  teamRoles: ProjectTeamRole[];
  createdBy: UUID;
}
export interface ProjectUpdate {
  projectName: string;
  projectPeriod: string;
  startDate: string;
  deadlineDate: string;
  projectStatus: string;
  generalDescription: string;
  technologyStack: TechnologyStackDto[];
  teamRoles: ProjectTeamRoleDto[];
}

export interface TechnologyStackDto {
  technologyName: string;
}
export interface ProjectTeamRoleDto {
  teamRoleId: string;
  noOfMembers: number;
}
export interface TechnologyStack {
  id: UUID;
  technologyName: string;
}

interface ProjectTeamRole {
  id: UUID;
  teamRole: TeamRole;
  noOfMembers: number;
  projectId: UUID;
}

export interface ViewEmployeeProjectDto {
  currentProjects: Project[];
  pastProjects: Project[];
}
export interface ViewProjectTeam {
  proposedMembers: User[];
  activeMembers: User[];
  pastMembers: User[];
}
export interface ProjectWithMembers {
  project: Project;
  members: User[];
}
export const getProjects = async (): Promise<Project[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/project`;
    const response = await axios.get<Project[]>(
      "http://localhost:8080/project",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error))
      console.error("Error fetching team roles:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};

export const createProject = async (
  newProject: ProjectUpdate
): Promise<ProjectUpdate | null> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post<ProjectUpdate>(
      "http://localhost:8080/project",
      newProject,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating the project:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:8080/project/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting team role:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return false;
  }
};

export const updateProject = async (
  projectId: UUID,
  updatedProject: ProjectUpdate
): Promise<ProjectUpdate | null> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put<ProjectUpdate>(
      `http://localhost:8080/project/${projectId}`,
      updatedProject,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating team role:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
};

export const filterProjectsByPeriod = async (
  projPeriod: string
): Promise<Project[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/project/filter-by-project-period?projectPeriod=${projPeriod}`;
    const response = await axios.get<Project[]>(
      `http://localhost:8080/project/filter-by-project-period?projectPeriod=${projPeriod}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error))
      console.error("Error fetching team roles:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};

export const filterProjectsByStatus = async (
  projStatus: string
): Promise<Project[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/project/filter-by-project-status?projectStatus=${projStatus}`;
    const response = await axios.get<Project[]>(
      `http://localhost:8080/project/filter-by-project-status?projectStatus=${projStatus}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error))
      console.error("Error fetching team roles:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};

export const getProjectsByUserId = async (
  employeeId: string
): Promise<ViewEmployeeProjectDto | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/project/view-employee-projects/${employeeId}`;
    const response = await axios.get<ViewEmployeeProjectDto>(
      `http://localhost:8080/project/view-employee-projects/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error))
      console.error("Error fetching team roles:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};

export const getProjectById = async (
  projectId: string
): Promise<Project | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/project/${projectId}`;
    const response = await axios.get<Project>(
      `http://localhost:8080/project/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error))
      console.error("Error fetching team roles:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};

export const getMembersByProjectId = async (
  projectId: string
): Promise<ViewProjectTeam | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/user-project/users-by-projectId/${projectId}`;
    const response = await axios.get<ViewProjectTeam>(
      `http://localhost:8080/user-project/users-by-projectId/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error))
      console.error("Error fetching team roles:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};

export const getProjectsForDepartment = async (): Promise<
  ProjectWithMembers[] | null
> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/project/view-departments-projects`;
    const response = await axios.get<ProjectWithMembers[]>(
      `http://localhost:8080/project/view-departments-projects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error))
      console.error("Error fetching team roles:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};
