import { Badge, Group, Paper, Text, Title } from "@mantine/core";
import { SkillDto } from "../../api-services/userService";

type SkillCardProps = {
  skill: SkillDto;
};
const SkillCard = ({ skill }: SkillCardProps) => {
  return (
    <div>
      <Paper withBorder p="sm" shadow="md" mb={5}>
        <Group justify="space-between">
          <Group gap={5}>
            <Title order={5}>{skill.skillName}</Title>
            <Text size="sm" c="dimmed">
              - {skill.skillCategory}
            </Text>
          </Group>
          <Badge variant="default">{skill.skillLevel}</Badge>
        </Group>
        <Text size="sm" c="dimmed">
          {skill.skillDescription}
        </Text>
        <Title order={6}>{skill.skillExperience}</Title>
      </Paper>
    </div>
  );
};

export default SkillCard;
