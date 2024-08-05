"use client";
import React from "react";
import { Container, Text, Title, Divider, Paper } from "@mantine/core";
import { InvitationTable } from "@/app/lib/tables/InvitationTable";

import withAuthorization from "@/app/components/path/to/withAuth";

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Title order={3}>Dashboard</Title>
      <Divider my="md" />
      <Paper shadow="xs" p="lg" withBorder>
        <Text size="lg" fw={700}>
          Invite your first user
        </Text>
        <Text size="sm" c="dimmed">
          Add members to your team. Once the invitation is used, it will become
          unavailable.
        </Text>

        <InvitationTable />
      </Paper>
      <Container size="sm" style={{ margin: 0, padding: 0 }}></Container>
    </div>
  );
};

export default withAuthorization(DashboardPage, [
  "Organization_Admin",
  "Employee",
]);
