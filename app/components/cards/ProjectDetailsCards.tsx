import { Project } from "@/app/api-services/projectServices";
import { Badge, Group, Paper, Text } from "@mantine/core";
import React from "react";
type ProjectDetailsCardsProps = {
  project?: Project;
};
const ProjectDetailsCards = ({ project }: ProjectDetailsCardsProps) => {
  return (
    <div>
      <Group>
        <Paper mt="lg" p="lg" withBorder shadow="none">
          <Group gap={5}>
            Period: <Text fw={600}>{project?.projectPeriod}</Text>
          </Group>
        </Paper>
        <Paper mt="lg" p="lg" withBorder shadow="none">
          <Group gap={5}>
            Start date: <Text fw={600}>{project?.startDate}</Text>
          </Group>
        </Paper>
        <Paper mt="lg" p="lg" withBorder shadow="none">
          <Group gap={5}>
            Deadline date:
            <Text fw={600}>
              {project &&
                project.deadlineDate === null &&
                `Project doesn't have a finish date  because is ongoing`}
              {project &&
                project.deadlineDate !== null &&
                new Date(project.deadlineDate).toDateString()}
            </Text>
          </Group>
        </Paper>
      </Group>
      <Group>
        <Paper mt="lg" p="lg" withBorder shadow="none">
          <Group gap={5}>
            Status: <Text fw={600}>{project?.projectStatus}</Text>
          </Group>
        </Paper>
        <Paper mt="lg" p="lg" withBorder shadow="none">
          <Group gap={5}>
            Description: <Text fw={600}>{project?.generalDescription}</Text>
          </Group>
        </Paper>
        <Paper mt="lg" p="lg" withBorder shadow="none">
          <Group gap={5}>
            Technology Stack:
            {project?.technologyStack.map((tech) => (
              <Badge variant="default">{tech.technologyName}</Badge>
            ))}
          </Group>
        </Paper>
      </Group>
    </div>
  );
};

export default ProjectDetailsCards;
