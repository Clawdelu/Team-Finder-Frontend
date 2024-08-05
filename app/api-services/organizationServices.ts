import axios from "axios";
import { UUID } from "crypto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Organization {
  id: UUID;
  createdBy: UUID;
  organizationName: string;
  headquarterAddress: string;
}

export const getOrganizationByInvite = async (
  inviteId: string
): Promise<Organization | null> => {
  try {
    const token = localStorage.getItem("token");
    let URL = `${API_URL}/organizations`;
    const response = await axios.get<Organization>(
      `http://localhost:8080/organizations/invite/${inviteId}`,
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
