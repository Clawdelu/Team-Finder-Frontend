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

export function LoginDrawer() {
  const [l_opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={l_opened}
        onClose={close}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        offset={8}
        radius="md"
      >
        <Container size={420} my={40}>
          <Title ta="center" className={classes.title}>
            Welcome back!
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Do not have an account yet?{" "}
            <Link href="#" style={{ textDecoration: "none" }}>
              <Anchor size="sm" component="button" onClick={open}>
                Create account
              </Anchor>
            </Link>
          </Text>

          <Paper p={30} mt={30}>
            <TextInput
              label="Email"
              placeholder="john.doe@example.com"
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
            />
            <Button fullWidth mt="xl">
              Sign in
            </Button>
          </Paper>
        </Container>
      </Drawer>

      <Button variant="default" onClick={open}>
        Log in
      </Button>
    </>
  );
}
