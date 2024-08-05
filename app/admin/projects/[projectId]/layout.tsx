import { getProjectById } from "@/app/api-services/projectServices";
import { Divider, Title } from "@mantine/core";
import React from "react";

async function fetchProject(projectId: string) {
  const project = await getProjectById(projectId);
  console.log("Project object:", project);
  return project;
}

export default async function ProjectsPageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { projectId: string };
}>) {
  const project = await fetchProject(params.projectId);

  return (
    <div>
      {/* <Title order={3}>Project {project?.projectName}</Title>
      <Divider my="md" /> */}

      {children}
    </div>
  );
}
