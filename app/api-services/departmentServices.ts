import axios from "axios";
import { UUID } from "crypto";
import { User } from "./userService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface Department {
  id: UUID;
  departmentName: string;
  createdBy: UUID;
  departmentManager: UUID;
}

interface DepartmentUpdate {
  departmentName: string;
  departmentManager?: string;
}

export const getAllDepartments = async (): Promise<Department[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/departments/same-organization`;
    const response = await axios.get<Department[]>(
      "http://localhost:8080/departments/same-organization",
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
      console.error("Error fetching invites:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};

export const updateDepartment = async (
  departmentId: UUID,
  updatedDepartment: DepartmentUpdate
): Promise<DepartmentUpdate | null> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put<DepartmentUpdate>(
      `http://localhost:8080/departments/${departmentId}`,
      updatedDepartment,
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

export const deleteDepartment = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:8080/departments/${id}`, {
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

export const createDepartment = async (
  newDepartment: DepartmentUpdate
): Promise<DepartmentUpdate | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post<DepartmentUpdate>(
      "http://localhost:8080/departments",
      newDepartment,
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

export const addMembersToDepartment = async (members: string[]) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch<any>(
      "http://localhost:8080/departments/add-members",
      members,
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
      console.error("Error adding members to department:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
};
export const getMembersFromDepartment = async (): Promise<User[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/departments/members`;
    const response = await axios.get<User[]>(
      `http://localhost:8080/departments/members`,
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
      console.error("Error fetching invites:", error.message);
    else console.log("Unexpected error:", error);
    return null;
  }
};
export const removeMembersFromDepartment = async (members: string[]) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch<any>(
      "http://localhost:8080/departments/remove-members",
      members,
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
      console.error("Error adding members to department:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
};
