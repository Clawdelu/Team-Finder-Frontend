import axios from "axios";
import { UUID } from "crypto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface TeamRole {
  id: UUID;
  roleInProject: string;
  createdBy: UUID;
}

interface TeamRoleUpdate {
  roleInProject: string;
}

export const getTeamRoles = async (): Promise<TeamRole[] | null> => {
  try {
    const token = localStorage.getItem("token");
    const token1 =
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJQcm9qZWN0X01hbmFnZXIiLCJFbXBsb3llZSIsIk9yZ2FuaXphdGlvbl9BZG1pbiJdLCJzdWIiOiJkYW5pZWxAZ21haWwuY29tIiwiaWF0IjoxNzE2Mzg4MTIyLCJleHAiOjE3MTg5ODAxMjJ9.rt0-i2xtdGeKIhd8ggN1X-1GQ-VKWlI6BEbjicqOS50";
    let URL = `${API_URL}/team-roles/same-organization`;
    const response = await axios.get<TeamRole[]>(
      "http://localhost:8080/team-roles/same-organization",
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

export const updateTeamRole = async (
  teamRoleId: UUID,
  updatedRole: TeamRoleUpdate
): Promise<TeamRoleUpdate | null> => {
  try {
    const token = localStorage.getItem("token");
    const token1 =
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJQcm9qZWN0X01hbmFnZXIiLCJFbXBsb3llZSIsIk9yZ2FuaXphdGlvbl9BZG1pbiJdLCJzdWIiOiJkYW5pZWxAZ21haWwuY29tIiwiaWF0IjoxNzE2Mzg4MTIyLCJleHAiOjE3MTg5ODAxMjJ9.rt0-i2xtdGeKIhd8ggN1X-1GQ-VKWlI6BEbjicqOS50";

    const response = await axios.put<TeamRoleUpdate>(
      `http://localhost:8080/team-roles/${teamRoleId}`,
      updatedRole,
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

export const createTeamRole = async (
  newRole: TeamRoleUpdate
): Promise<TeamRoleUpdate | null> => {
  try {
    const token = localStorage.getItem("token");
    const token1 =
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJQcm9qZWN0X01hbmFnZXIiLCJFbXBsb3llZSIsIk9yZ2FuaXphdGlvbl9BZG1pbiJdLCJzdWIiOiJkYW5pZWxAZ21haWwuY29tIiwiaWF0IjoxNzE2Mzg4MTIyLCJleHAiOjE3MTg5ODAxMjJ9.rt0-i2xtdGeKIhd8ggN1X-1GQ-VKWlI6BEbjicqOS50";

    const response = await axios.post<TeamRoleUpdate>(
      "http://localhost:8080/team-roles",
      newRole,
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
      console.error("Error creating team role:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
};

export const deleteTeamRole = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    const token1 =
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJQcm9qZWN0X01hbmFnZXIiLCJFbXBsb3llZSIsIk9yZ2FuaXphdGlvbl9BZG1pbiJdLCJzdWIiOiJkYW5pZWxAZ21haWwuY29tIiwiaWF0IjoxNzE2Mzg4MTIyLCJleHAiOjE3MTg5ODAxMjJ9.rt0-i2xtdGeKIhd8ggN1X-1GQ-VKWlI6BEbjicqOS50";

    await axios.delete(`http://localhost:8080/team-roles/${id}`, {
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
