import axios from "axios";
import { UUID } from "crypto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface Invite {
  id: UUID;
  organizationId: UUID;
  createdBy: UUID;
  available: boolean;
}
interface InvitePOST {
  id: UUID;
}

export const getAllInivtes = async (): Promise<Invite[] | null> => {
  try {
    const token = localStorage.getItem("token");
    const token1 =
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJQcm9qZWN0X01hbmFnZXIiLCJFbXBsb3llZSIsIk9yZ2FuaXphdGlvbl9BZG1pbiJdLCJzdWIiOiJkYW5pZWxAZ21haWwuY29tIiwiaWF0IjoxNzE2Mzg4MTIyLCJleHAiOjE3MTg5ODAxMjJ9.rt0-i2xtdGeKIhd8ggN1X-1GQ-VKWlI6BEbjicqOS50";
    let URL = `${API_URL}/invites`;
    const response = await axios.get<Invite[]>(
      "http://localhost:8080/invites",
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

export const createInvite = async (): Promise<InvitePOST | null> => {
  try {
    const token = localStorage.getItem("token");
    const token1 =
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJQcm9qZWN0X01hbmFnZXIiLCJFbXBsb3llZSIsIk9yZ2FuaXphdGlvbl9BZG1pbiJdLCJzdWIiOiJkYW5pZWxAZ21haWwuY29tIiwiaWF0IjoxNzE2Mzg4MTIyLCJleHAiOjE3MTg5ODAxMjJ9.rt0-i2xtdGeKIhd8ggN1X-1GQ-VKWlI6BEbjicqOS50";

    const response = await axios.post(
      "http://localhost:8080/invites",
      {},
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
      console.error("Error creating invite:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
};

export const deleteInvite = async (inviteId: UUID): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    const token1 =
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJQcm9qZWN0X01hbmFnZXIiLCJFbXBsb3llZSIsIk9yZ2FuaXphdGlvbl9BZG1pbiJdLCJzdWIiOiJkYW5pZWxAZ21haWwuY29tIiwiaWF0IjoxNzE2Mzg4MTIyLCJleHAiOjE3MTg5ODAxMjJ9.rt0-i2xtdGeKIhd8ggN1X-1GQ-VKWlI6BEbjicqOS50";

    await axios.delete(`http://localhost:8080/invites/${inviteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting invite:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return false;
  }
};
