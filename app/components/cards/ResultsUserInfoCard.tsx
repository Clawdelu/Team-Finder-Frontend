import { Project } from "@/app/api-services/projectServices";
import {
  getSkillsByUserId,
  SkillDto,
  User,
} from "@/app/api-services/userService";
import { Badge, Flex, Group, Paper, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import ModalCreatePropose from "../modals/ModalCreatePropose";

interface UserSkills {
  userId: string;
  skills: SkillDto[];
}

const ResultsUserInfoCard = ({
  users,
  project,
}: {
  users: User[];
  project: Project;
}) => {
  const [userSkills, setUserSkills] = useState<UserSkills[]>([]);
  const [usersRefresh, setUsersRefresh] = useState<User[]>([]);

  useEffect(() => {
    setUsersRefresh(users);
  }, [users]);
  useEffect(() => {
    const fetchProject = async () => {
      if (usersRefresh) {
        try {
          const skillsPromises = usersRefresh.map(async (user) => {
            const skills = await getSkillsByUserId(user.id);
            return { userId: user.id, skills: skills || [] };
          });

          const skillsResults = await Promise.all(skillsPromises);
          setUserSkills(skillsResults);
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          //setLoading(false);
        }
      }
    };

    fetchProject();
  }, [usersRefresh]);

  return (
    <div>
      <Title order={3} mt="xl" mb="md">
        Results
      </Title>
      <Flex gap="md" wrap="nowrap" maw="90vw" align="center" mt="xl">
        {usersRefresh.map((user) => (
          <Paper
            key={user.id}
            p="md"
            shadow="none"
            withBorder
            maw={500}
            w={400}
          >
            <Group justify="space-between">
              <Text>{user.userName}</Text>
              <ModalCreatePropose
                project={project}
                userId={user.id}
                usersRefresh={usersRefresh}
                setUsersRefresh={setUsersRefresh}
                userName={user.userName}
              />
            </Group>

            <Group mt="md">
              {userSkills
                .find((us) => us.userId === user.id)
                ?.skills.map((skill) => (
                  <Badge key={skill.skillName} variant="default">
                    {skill.skillName}
                  </Badge>
                ))}
            </Group>
          </Paper>
        ))}
      </Flex>
    </div>
  );
};

export default ResultsUserInfoCard;
