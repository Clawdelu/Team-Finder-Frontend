import axios from "axios";
import { UUID } from "crypto";
import { SkillCategory } from "./categoryService";
import { Department } from "./departmentServices";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface Skill {
  id: UUID;
  createdBy: UUID;
  skillName: string;
  description: string;
  skillCategory: SkillCategory;
  departments: Department[];
}

export interface SkillUpdate {
  skillCategoryId: string;
  skillName: string;
  description: string;
  addedToDepartment: boolean;
}

export const getSkills = async (): Promise<Skill[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/skills/same-organization`;
    const response = await axios.get<Skill[]>(
      "http://localhost:8080/skills/same-organization",
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

export const filterSkillsByCategoryId = async (
  categoryId: string
): Promise<Skill[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/skills/skill-category?skillCategoryId=${categoryId}`;
    const response = await axios.get<Skill[]>(
      `http://localhost:8080/skills/skill-category?skillCategoryId=${categoryId}`,
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

export const updateSkill = async (
  skillId: UUID,
  updatedSkill: SkillUpdate
): Promise<SkillUpdate | null> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put<SkillUpdate>(
      `http://localhost:8080/skills/${skillId}`,
      updatedSkill,
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

export const createSkill = async (
  newSkill: SkillUpdate
): Promise<SkillUpdate | null> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post<SkillUpdate>(
      "http://localhost:8080/skills",
      newSkill,
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

export const deleteSkill = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:8080/skills/${id}`, {
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

export const getSkillsBySameDepart = async (): Promise<Skill[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/skills/same-department`;
    const response = await axios.get<Skill[]>(
      "http://localhost:8080/skills/same-department",
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

export const getSkillsBySameAuthor = async (): Promise<Skill[] | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/skills/same-author`;
    const response = await axios.get<Skill[]>(
      "http://localhost:8080/skills/same-author",
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

export const addSkillToDepartment = async (
  skillId: string
): Promise<string | null> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch<string>(
      `http://localhost:8080/skills/${skillId}/add-skill-to-department`,
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
      console.error("Error updating team role:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
};
export const removeSkillFromDepartment = async (skillId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:8080/skills/${skillId}/remove-skill-from-department`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    console.log("Skill removed successfully:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error removing skill from department:",
        error.response?.data
      );
    } else {
      console.error("Unexpected error:", error);
    }
  }
};
