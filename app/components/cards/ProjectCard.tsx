import { Badge, Group, Paper, Text, Title } from "@mantine/core";
import { SkillDto } from "../../api-services/userService";
import { Project } from "@/app/api-services/projectServices";

type ProjectCardProps = {
  project: Project;
};
const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div>
      <Paper withBorder p="sm" shadow="md" mb={5}>
        <Group justify="space-between">
          <Group gap={5}>
            <Title order={5}>{project.projectName}</Title>
            <Text size="sm" c="dimmed">
              - asa
            </Text>
          </Group>
          <Badge variant="default">level</Badge>
        </Group>
        <Text size="sm" c="dimmed">
          descr
        </Text>
        <Title order={6}>exper</Title>
      </Paper>
    </div>
  );
};

export default ProjectCard;
