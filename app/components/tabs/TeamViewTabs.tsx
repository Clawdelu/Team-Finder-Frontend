import {
  getMembersByProjectId,
  ViewProjectTeam,
} from "@/app/api-services/projectServices";
import { getSkillsByUserId, SkillDto } from "@/app/api-services/userService";
import { Badge, Button, Group, Paper, Tabs, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import ModalCreateDeallocation from "../modals/ModalCreateDeallocation";
interface UserSkills {
  userId: string;
  skills: SkillDto[];
}
const TeamViewTabs = ({ projectId }: { projectId: string }) => {
  const [proposedSkills, setProposedSkills] = useState<UserSkills[]>([]);
  const [activeSkills, setActiveSkills] = useState<UserSkills[]>([]);
  const [pastSkills, setPastSkills] = useState<UserSkills[]>([]);
  const [members, setMembers] = useState<ViewProjectTeam>();
  useEffect(() => {
    const fetchMembers = async () => {
      if (projectId) {
        try {
          const projectMembers = await getMembersByProjectId(
            projectId.toString()
          );
          if (projectMembers) setMembers(projectMembers);
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          // setLoading(false);
        }
      }
    };
    const fetchSkills = async () => {
      if (members) {
        try {
          const skillsPromises = members.proposedMembers.map(async (user) => {
            const skills = await getSkillsByUserId(user.id);
            return { userId: user.id, skills: skills || [] };
          });
          const skillsResults = await Promise.all(skillsPromises);
          setProposedSkills(skillsResults);

          const skillsPromises1 = members.activeMembers.map(async (user) => {
            const skills = await getSkillsByUserId(user.id);
            return { userId: user.id, skills: skills || [] };
          });
          const skillsResults1 = await Promise.all(skillsPromises1);
          setActiveSkills(skillsResults1);

          const skillsPromises2 = members.pastMembers.map(async (user) => {
            const skills = await getSkillsByUserId(user.id);
            return { userId: user.id, skills: skills || [] };
          });
          const skillsResults2 = await Promise.all(skillsPromises2);
          setPastSkills(skillsResults2);
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
        }
      }
    };

    fetchSkills();
    fetchMembers();
  }, [projectId]);
  return (
    <div>
      <Tabs variant="outline" defaultValue="proposed" mt="xl">
        <Tabs.List>
          <Tabs.Tab value="proposed">Proposed members</Tabs.Tab>
          <Tabs.Tab value="active">Active members</Tabs.Tab>
          <Tabs.Tab value="past">Past members</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="proposed">
          {members?.proposedMembers.length ? (
            members.proposedMembers.map((member) => (
              <Paper
                key={member.id}
                p="md"
                shadow="none"
                withBorder
                maw={500}
                w={400}
                mt="md"
              >
                <Group justify="space-between">
                  <Text>{member.userName}</Text>
                  <Text size="sm">{member.email}</Text>
                  {/* <ModalCreateDeallocation
                    projectId={projectId}
                    userId={member.id}
                    userName={member.userName}
                  /> */}
                </Group>

                <Group mt="md">
                  {proposedSkills
                    .find((us) => us.userId === member.id)
                    ?.skills.map((skill) => (
                      <Badge key={skill.skillName} variant="default">
                        {skill.skillName}
                      </Badge>
                    ))}
                </Group>
              </Paper>
            ))
          ) : (
            <Title order={4} mt="md">
              No members
            </Title>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="active">
          {members?.activeMembers.length ? (
            members.activeMembers.map((member) => (
              <Paper
                key={member.id}
                p="md"
                shadow="none"
                withBorder
                maw={500}
                w={400}
                mt="md"
              >
                <Group justify="space-between">
                  <Text>{member.userName}</Text>
                  <ModalCreateDeallocation
                    projectId={projectId}
                    userId={member.id}
                    userName={member.userName}
                  />
                </Group>

                <Group mt="md">
                  {activeSkills
                    .find((us) => us.userId === member.id)
                    ?.skills.map((skill) => (
                      <Badge key={skill.skillName} variant="default">
                        {skill.skillName}
                      </Badge>
                    ))}
                </Group>
              </Paper>
            ))
          ) : (
            <Title order={4} mt="md">
              No members
            </Title>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="past">
          {members?.pastMembers.length ? (
            members.pastMembers.map((member) => (
              <Paper
                key={member.id}
                p="md"
                shadow="none"
                withBorder
                maw={500}
                w={400}
                mt="md"
              >
                <Group justify="space-between">
                  <Text>{member.userName}</Text>
                  <Text size="sm">{member.email}</Text>
                  {/* <Button variant="default">Create deallocation</Button> */}
                </Group>

                <Group mt="md">
                  {pastSkills
                    .find((us) => us.userId === member.id)
                    ?.skills.map((skill) => (
                      <Badge key={skill.skillName} variant="default">
                        {skill.skillName}
                      </Badge>
                    ))}
                </Group>
              </Paper>
            ))
          ) : (
            <Title order={4} mt="md">
              No members
            </Title>
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default TeamViewTabs;
