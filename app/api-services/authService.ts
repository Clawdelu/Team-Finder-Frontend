import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL! + "/auth";
type DecodedToken = {
  exp: number;
  roles: string[];
};
export const storeToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return false;
  }

  const now = new Date().getTime() / 1000;
  return now < decoded.exp;
};

export const hasSomeRoles = (
  token: string | null,
  requiredRoles: string[]
): boolean => {
  if (!token) {
    return false;
  }

  const decoded = decodeToken(token);
  if (!decoded || !decoded.roles) {
    return false;
  }

  return requiredRoles.some((role) => decoded.roles.includes(role));
};

export const authenticate = async (email: string, password: string) => {
  try {
    console.log(API_URL);
    const response = await axios.post(
      "http://localhost:8080/auth/authenticate",
      {
        email,
        password,
      }
    );
    return response.data.token;
  } catch (error) {
    console.error("Error authenticating", error);
    throw error;
  }
};

export const registerByInvite = async (
  name: string,
  email: string,
  password: string,
  inviteId: string
) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/auth/register/${inviteId}`,
      {
        name,
        email,
        password,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering by invite", error);
    throw error;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  organizationName: string,
  headquarterAddress: string
) => {
  try {
    const response = await axios.post(`http://localhost:8080/auth/register`, {
      name,
      email,
      password,
      organizationName,
      headquarterAddress,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering", error);
    throw error;
  }
};
