import axios from "axios";
import { TeamRole } from "./teamRolesServices";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type DeallocationUpdate = {
  deallocationReason: string;
  userId: string;
  projectId: string;
};

export type Deallocation = {
  id: string;
  deallocationReason: string;
  userId: string;
  projectId: string;
  status: string;
};
export const createDeallocation = async (
  newAssign: DeallocationUpdate
): Promise<DeallocationUpdate | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post<DeallocationUpdate>(
      "http://localhost:8080/deallocation-proposal",
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
export const getDeallocations = async (): Promise<Deallocation[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/deallocation-proposal`;
    const response = await axios.get<Deallocation[]>(
      `http://localhost:8080/deallocation-proposal`,
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
export const updateDeallStatus = async (
  status: string,
  assId: string
): Promise<Deallocation | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.put<Deallocation>(
      `http://localhost:8080/deallocation-proposal/change-proposal-status/${assId}?proposalStatus=${status}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating deallocation status:", error.message);
      console.error("Error response data:", error.response?.data);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
};
export const deleteDeallocationById = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:8080/deallocation-proposal/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting deallocation:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return false;
  }
};
export const getDeallocationsByProjectId = async (
  projectId: string
): Promise<Deallocation[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/deallocation-proposal/byprojectid/${projectId}`;
    const response = await axios.get<Deallocation[]>(
      `http://localhost:8080/deallocation-proposal/byprojectid/${projectId}`,
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
export const getDeallocaionsDepartManager = async (): Promise<
  Deallocation[] | null
> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/deallocation-proposal/department-manager`;
    const response = await axios.get<Deallocation[]>(
      `http://localhost:8080/deallocation-proposal/department-manager`,
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
