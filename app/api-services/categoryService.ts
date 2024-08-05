import axios from "axios";
import { UUID } from "crypto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type SkillCategory = {
  id: UUID;
  skillCategoryName: string;
};
type SkillCategoryCreate = {
  skillCategoryName: string;
};

export const getAllCategories = async (): Promise<SkillCategory[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/skills-category/same-organization`;
    const response = await axios.get<SkillCategory[]>(
      "http://localhost:8080/skills-category/same-organization",
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
export const createCategory = async (
  newCategory: SkillCategoryCreate
): Promise<SkillCategory | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post<SkillCategory>(
      "http://localhost:8080/skills-category",
      newCategory,
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
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:8080/skills-category/${id}`, {
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
export const updateCategory = async (
  teamCategoryId: UUID,
  updatedCategory: SkillCategoryCreate
): Promise<SkillCategory | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put<SkillCategory>(
      `http://localhost:8080/skills-category/${teamCategoryId}`,
      updatedCategory,
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
