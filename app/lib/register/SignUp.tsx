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
import classes from "./SignUp.module.css";
import Link from "next/link";
import LogoSVGW from "@/app/svg-components/LogoSVGW";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser, storeToken } from "@/app/api-services/authService";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
  organizationName: z.string().min(2),
  headquarterAddress: z.string().min(2),
});

type FormFields = z.infer<typeof schema>;

export function RegisterPage() {
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
      const response = await registerUser(
        data.name,
        data.email,
        data.password,
        data.organizationName,
        data.headquarterAddress
      );
      let token = response.token;
      if (token) {
        storeToken(token);
        router.push("/admin/dashboard");
      } else {
        console.error("Failed to register");
      }

      console.log(data);
      console.log("Register successful", response);
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
            <LogoSVGW />
          </Box>
        </div>
      </Portal>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Create your account
        </Title>
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
          <TextInput
            {...register("organizationName")}
            size="md"
            label="Organization"
            placeholder="Organization"
            mt="lg"
            required
          />
          {errors.organizationName && (
            <Text c="red">{errors.organizationName.message}</Text>
          )}
          <TextInput
            {...register("headquarterAddress")}
            size="md"
            label="Address"
            placeholder="Headquarter Address"
            required
          />
          {errors.headquarterAddress && (
            <Text c="red">{errors.headquarterAddress.message}</Text>
          )}
          <Button
            fullWidth
            mt="xl"
            size="md"
            variant="gradient"
            gradient={{ from: "pink", to: "yellow" }}
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
