"use client";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Portal,
  Box,
} from "@mantine/core";
import classes from "./SignUpEmployee.module.css";
import Link from "next/link";
import LogoSVG from "@/app/svg-components/LogoSVG";
import { useEffect, useState } from "react";
import { getOrganizationByInvite } from "@/app/api-services/organizationServices";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { registerByInvite, storeToken } from "@/app/api-services/authService";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
});
type FormFields = z.infer<typeof schema>;

export function SignUpEmployee({ invitationId }: { invitationId: string }) {
  const [orgName, setOrgName] = useState<string>("");
  useEffect(() => {
    const getOrgName = async () => {
      const organization = await getOrganizationByInvite(invitationId);
      if (organization) setOrgName(organization.organizationName);
    };
    getOrgName();
  }, []);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await registerByInvite(
        data.name,
        data.email,
        data.password,
        invitationId
      );
      let token = response.token;
      if (token) {
        storeToken(token);
        router.push("/admin/dashboard");
      } else {
        console.error("Failed to register by invite");
      }

      console.log(data);
      console.log("Register by Id successful", response);
    } catch (error) {
      setError("root", {
        message: "Failed to authenticate. Please check your credentials.",
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Portal>
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 15,
          }}
        >
          <Box component={Link} href="/">
            <LogoSVG />
          </Box>
        </div>
      </Portal>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md">
          Precision Team Building
        </Title>
        <Text ta="center" mt="md" mb={50}>
          Register to start working in {orgName}
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            {...register("name")}
            size="md"
            label="Name"
            placeholder="Your name"
            required
          />
          {errors.name && <Text c="red">{errors.name.message}</Text>}
          <TextInput
            {...register("email")}
            size="md"
            label="Email"
            placeholder="john.doe@example.com"
            required
            mt="md"
          />
          {errors.email && <Text c="red">{errors.email.message}</Text>}
          <PasswordInput
            {...register("password")}
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            required
          />
          {errors.password && <Text c="red">{errors.password.message}</Text>}

          <Button
            fullWidth
            mt="xl"
            size="md"
            type="submit"
            loading={isSubmitting}
          >
            Register
          </Button>
          {errors.root && <Text c="red">{errors.root.message}</Text>}
        </form>
        <Text ta="center" mt="md">
          Already have an account?{" "}
          <Anchor component={Link} href="/login" fw={700}>
            Login
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
