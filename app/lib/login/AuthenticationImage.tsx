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
import classes from "./AuthenticationImage.module.css";
import Link from "next/link";
import LogoSVG from "@/app/svg-components/LogoSVG";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticate, storeToken } from "@/app/api-services/authService";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

type FormFields = z.infer<typeof schema>;

export function AuthenticationImage() {
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
      const token = await authenticate(data.email, data.password);
      if (token) {
        // const decode = decodeToken(token);
        // console.log("Decoded Token:", decode);
        storeToken(token);
        router.push("/admin/dashboard");
      } else {
        console.error("Failed to login");
      }
      console.log(data);
      console.log("Authentication successful", token);
      // router.push("/admin/dashboard");
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
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome back!
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <Button
            type="submit"
            fullWidth
            mt="xl"
            size="md"
            loading={isSubmitting}
          >
            Login
          </Button>
          {errors.root && <Text c="red">{errors.root.message}</Text>}
        </form>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor component={Link} href="/register" fw={700}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
