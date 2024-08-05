"use client";
import ModalCreateNewRole from "@/app/components/modals/ModalCreateNewRole";
import { TeamRolesTable } from "@/app/lib/tables/TeamRolesTable";
import { Divider, Title, Text, Box } from "@mantine/core";

import React from "react";

const TeamRolesPage = () => {
  return (
    <div>
      <Title order={3}>Team Roles</Title>
      <Divider my="md" />
      <Box m="md">
        <Box w={{ base: 200, sm: 400, lg: 500 }} mb="lg">
          <Text size="lg" fw={700}>
            Customize Team Roles for Your Organization
          </Text>
          <Text size="sm" c="dimmed" mb="lg">
            Customize team roles to fit your organization’s unique needs.
            Empower administrators to define, create, and manage roles tailored
            to their team structure and workflow.
          </Text>

          <TeamRolesTable />
          {/* <ModalCreateNewRole /> */}
        </Box>
      </Box>
    </div>
  );
};

export default TeamRolesPage;
