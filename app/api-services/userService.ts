import axios from "axios";
import { UUID } from "crypto";
import { Roles } from "../enums/enums";
import { Skill } from "./skillServices";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface User {
  id: UUID;
  userName: string;
  email: string;
  roles: Roles[];
}

export type SkillDto = {
  skillName: string;
  skillCategory: string;
  skillDescription: string;
  skillExperience: string;
  skillLevel: string;
};

interface UserSkillDto {
  level: string;
  experience: string;
}

export interface MySkillsDetail {
  id: UUID;
  skill: Skill;
  level: string;
  experience: string;
}

export const getUsers = async (): Promise<User[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/same-organization`;
    const response = await axios.get<User[]>(
      "http://localhost:8080/users/same-organization",
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
export const getAllUnasignedUsers = async (): Promise<User[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/unassigned`;
    const response = await axios.get<User[]>(
      "http://localhost:8080/users/unassigned",
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
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/same-organization`;
    const response = await axios.get<User>(
      `http://localhost:8080/users/${userId}`,
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
export const getDepartmentManagers = async (): Promise<User[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/department-manager`;
    const response = await axios.get<User[]>(
      "http://localhost:8080/users/department-manager",
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
export const assignRoles = async (
  userId: UUID,
  roles: Roles[]
): Promise<Roles[] | null> => {
  try {
    const token = localStorage.getItem("token");
    const token1 =
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJQcm9qZWN0X01hbmFnZXIiLCJFbXBsb3llZSIsIk9yZ2FuaXphdGlvbl9BZG1pbiJdLCJzdWIiOiJkYW5pZWxAZ21haWwuY29tIiwiaWF0IjoxNzE2Mzg4MTIyLCJleHAiOjE3MTg5ODAxMjJ9.rt0-i2xtdGeKIhd8ggN1X-1GQ-VKWlI6BEbjicqOS50";
    let URL = `${API_URL}/users/same-organization`;
    const response = await axios.patch<Roles[]>(
      `http://localhost:8080/users/${userId}/assign-roles`,
      roles,
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
export const getSkillsByUserId = async (
  userId: UUID
): Promise<SkillDto[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/${userId}/skills`;
    const response = await axios.get<SkillDto[]>(
      `http://localhost:8080/users/${userId}/skills`,
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
export const getConnectedUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/connected-user`;
    const response = await axios.get<User>(
      "http://localhost:8080/users/connected-user",
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
export const assignSkillToUser = async (
  skillId: UUID,
  userSkillDto: UserSkillDto
) => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/assign-skill-to-user/${skillId}`;
    const response = await axios.patch(
      `http://localhost:8080/users/assign-skill-to-user/${skillId}`,
      userSkillDto,
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
  }
};
export const removeSkillFromUser = async (skillId: UUID) => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/remove-skill-from-user/${skillId}`;
    const response = await axios.delete(
      `http://localhost:8080/users/remove-skill-from-user/${skillId}`,
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
  }
};
export const getMySkills = async (): Promise<MySkillsDetail[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/skills`;
    const response = await axios.get<MySkillsDetail[]>(
      "http://localhost:8080/users/skills",
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
export const getPartiallyAvailableUsers = async (
  porjectId: string
): Promise<User[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/partially-available-users?projectId=${porjectId}`;
    const response = await axios.get<User[]>(
      `http://localhost:8080/users/partially-available-users?projectId=${porjectId}`,
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
export const getUnavailableUsers = async (
  porjectId: string
): Promise<User[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/unavailable-users-for-project?projectId=${porjectId}`;
    const response = await axios.get<User[]>(
      `http://localhost:8080/users/unavailable-users-for-project?projectId=${porjectId}`,
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
export const getFullyAvailableUsers = async (
  porjectId: string
): Promise<User[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/fullly-available-users-for-project?projectId=${porjectId}`;
    const response = await axios.get<User[]>(
      `http://localhost:8080/users/fullly-available-users-for-project?projectId=${porjectId}`,
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
export const getUsersFromCloseToFinishProj = async (
  porjectId: string,
  weeks: string
): Promise<User[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/users/users-from-projects-close-to-finish-in-n-weeks/${weeks}?projectId=${porjectId}`;
    const response = await axios.get<User[]>(
      `http://localhost:8080/users/users-from-projects-close-to-finish-in-n-weeks/${weeks}?projectId=${porjectId}`,
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
