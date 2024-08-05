import axios from "axios";
import { UUID } from "crypto";
import { TeamRole } from "./teamRolesServices";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AssignmentUpdate = {
  workHours: number;
  teamRoleIds: string[];
  comments: string;
  userId: string;
  projectId: string;
};

export type Assignment = {
  id: string;
  workHours: number;
  teamRoles: TeamRole[];
  comments: string;
  userId: string;
  projectId: string;
  status: string;
};

export const getAssignmentsByProjectId = async (
  projectId: string
): Promise<Assignment[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/assignment-proposal/byprojectid/${projectId}`;
    const response = await axios.get<Assignment[]>(
      `http://localhost:8080/assignment-proposal/byprojectid/${projectId}`,
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
      console.error("Error fetching Assignments:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};
export const createAssignment = async (
  newAssign: AssignmentUpdate
): Promise<AssignmentUpdate | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post<AssignmentUpdate>(
      "http://localhost:8080/assignment-proposal",
      newAssign,
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
      console.error("Error creating assignment:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
};
export const deleteAssignmentsById = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:8080/assignment-proposal/${id}`, {
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
export const getAssignments = async (): Promise<Assignment[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/assignment-proposal`;
    const response = await axios.get<Assignment[]>(
      `http://localhost:8080/assignment-proposal`,
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
      console.error("Error fetching Assignments:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};
export const getAssignmentsDepartManager = async (): Promise<
  Assignment[] | null
> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/assignment-proposal/department-manager`;
    const response = await axios.get<Assignment[]>(
      `http://localhost:8080/assignment-proposal/department-manager`,
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
      console.error("Error fetching Assignments:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};

export const updateAssignStatus = async (
  status: string,
  assId: string
): Promise<Assignment | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch<Assignment>(
      `http://localhost:8080/assignment-proposal/${assId}/status?proposalStatus=${status}`,
      null,
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
      console.error("Error creating assignment:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
};

// export const updateCategory = async (
//   teamCategoryId: UUID,
//   updatedCategory: SkillCategoryCreate
// ): Promise<SkillCategory | null> => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.put<SkillCategory>(
//       `http://localhost:8080/skills-category/${teamCategoryId}`,
//       updatedCategory,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Error updating team role:", error.message);
//     } else {
//       console.log("Unexpected error:", error);
//     }
//     return null;
//   }
// };
