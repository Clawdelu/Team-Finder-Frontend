import { ViewProjectTeam } from "@/app/api-services/projectServices";
import { Badge, Flex, Paper, ScrollArea, Text } from "@mantine/core";
type ProjectMembersCardProps = {
  members?: ViewProjectTeam;
};
const ProjectMembersCard = ({ members }: ProjectMembersCardProps) => {
  return (
    <div>
      <ScrollArea.Autosize
        mah={400}
        maw="100%"
        mx="auto"
        type="auto"
        mt={10}
        bg="rgba(240,240,240,0.2)"
      >
        <Flex gap="md" wrap="wrap" maw="60vw">
          {members &&
            members.activeMembers.map((member) => (
              <Paper mt="lg" p="lg" withBorder shadow="none">
                <Text size="lg" fw={700}>
                  {member.userName}
                </Text>
                <Badge color="black">Active member</Badge>
              </Paper>
            ))}
          {/* {members &&
            members.proposedMembers.map((member) => (
              <Paper mt="lg" p="lg" withBorder shadow="none">
                <Text size="lg" fw={700}>
                  {member.userName}
                </Text>
                <Badge color="black">Proposed member</Badge>
              </Paper>
            ))}
            */}
        </Flex>
      </ScrollArea.Autosize>
    </div>
  );
};

export default ProjectMembersCard;
