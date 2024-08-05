// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
"use client";
import "@mantine/core/styles.css";

import { Flex, Paper } from "@mantine/core";
import { Navbar } from "../lib/navbar/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Flex style={{ height: "100vh", width: "100vw" }}>
        <Navbar />
        <Paper
          shadow="sm"
          pt={25}
          pl={15}
          pr={15}
          mt={10}
          mb={10}
          mr={10}
          withBorder
          style={{ width: "82vw" }}
        >
          {children}
        </Paper>
      </Flex>
    </section>
  );
}
