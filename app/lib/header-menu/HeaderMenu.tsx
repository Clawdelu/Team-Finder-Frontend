import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderMenu.module.css";
import Link from "next/link";
import LogoSVGW from "@/app/svg-components/LogoSVGW";
import { LoginDrawer } from "../drawer/LoginDrawer";
import { SignUpDrawer } from "../drawer/SignUpDrawer";

export function HeaderMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group>
            <LogoSVGW />
            <Title order={2} style={{ color: "#FFFFFF" }}>
              Squad Sync
            </Title>
          </Group>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="#" className={classes.link}>
              Company
            </Link>
            <Link href="#" className={classes.link}>
              Pricing
            </Link>
            <Link href="#" className={classes.link}>
              Contact
            </Link>
          </Group>

          <Group visibleFrom="sm">
            <Button variant="default" component={Link} href="/login">
              Log In
            </Button>
            <Button component={Link} href="/register">
              Sign up
            </Button>
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
            color="#FFFFFF"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link href="#" className={classes.link} style={{ color: "#000000" }}>
            Company
          </Link>
          <Link href="#" className={classes.link} style={{ color: "#000000" }}>
            Pricing
          </Link>
          <Link href="#" className={classes.link} style={{ color: "#000000" }}>
            Contact
          </Link>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
