import ProjectsTable from "@/app/lib/tables/ProjectsTable";
import { Button, Divider, Group, Title } from "@mantine/core";
import Link from "next/link";
import React from "react";

const ProjectsPage = () => {
  return (
    <div>
      <Group justify="space-between">
        <Title order={3}>Projects</Title>
        <Button href="/admin/projects/myprojects" component={Link}>
          My projects
        </Button>
      </Group>
      <Divider my="md" />
      <ProjectsTable />
    </div>
  );
};

export default ProjectsPage;
