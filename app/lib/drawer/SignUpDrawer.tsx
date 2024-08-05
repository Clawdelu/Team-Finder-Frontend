import { useDisclosure } from "@mantine/hooks";
import {
  Drawer,
  Button,
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
} from "@mantine/core";
import classes from "./LoginDrawer.module.css";
import Link from "next/link";
import { registerUserAction } from "@/app/data/actions/auth-actions";
import { useFormState } from "react-dom";
import { ZodErrors } from "@/app/components/ZodErrors";

const INITIAL_STATE = {
  data: null,
  zodErrors: null,
  message: null,
};
export function SignUpDrawer() {
  const [s_opened, { open, close }] = useDisclosure(false);
  const [formState, formAction] = useFormState(
    registerUserAction,
    INITIAL_STATE
  );

  console.log(formState, "client");

  return (
    <>
      <Drawer
        opened={s_opened}
        onClose={close}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        offset={8}
        radius="md"
      >
        <Container size={420} my={40}>
          <Title ta="center" className={classes.title}>
            Create your account
          </Title>

          <Paper p={30} mt={20}>
            <form action={formAction}>
              <TextInput
                label="Name"
                name="name"
                placeholder="Your name"
                required
              />
              <TextInput
                label="Email"
                name="email"
                placeholder="john.doe@example.com"
                required
              />
              <ZodErrors error={formState?.zodErrors?.email} />
              <PasswordInput
                label="Password"
                name="password"
                placeholder="Your password"
                required
              />
              <ZodErrors error={formState?.zodErrors?.password} />
              <TextInput
                label="Organization"
                name="organization"
                placeholder="Organization"
                required
                mt="lg"
              />
              <ZodErrors error={formState?.zodErrors?.organization} />
              <TextInput
                label="Address"
                name="address"
                placeholder="Headquarter Address"
                required
              />
              <ZodErrors error={formState?.zodErrors?.address} />
              <Button fullWidth mt="xl" type="submit">
                Register
              </Button>
            </form>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
              Already have an account?{" "}
              <Link href="#" style={{ textDecoration: "none" }}>
                <Anchor size="sm" component="button">
                  Sign In
                </Anchor>
              </Link>
            </Text>
          </Paper>
        </Container>
      </Drawer>

      <Button onClick={open}>Sign up</Button>
    </>
  );
}
