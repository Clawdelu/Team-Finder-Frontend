"use server";
import { z } from "zod";

const schemaRegister = z.object({
  name: z.string().min(2).max(100, {
    message: "Name must be between 2 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  organization: z.string().min(2).max(100, {
    message: "Organization must be between 2 and 100 characters",
  }),
  address: z.string().min(2).max(100, {
    message: "Organization must be between 2 and 100 characters",
  }),
});

export async function registerUserAction(prevState: any, formData: FormData) {
  console.log("Hello From Register User Action");

  const validatedFields = schemaRegister.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    organization: formData.get("organization"),
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  return {
    ...prevState,
    data: "ok",
  };
}
