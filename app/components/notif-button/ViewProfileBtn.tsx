import { getSkillsByUserId, Skill } from "@/app/api-services/userService";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Group,
  Modal,
  rem,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import SkillCard from "../cards/SkillCard";

type ViewProfileBtnProps = {
  id: UUID;
  refresh: boolean;
  userName: string;
  userEmail: string;
};

const ViewProfileBtn = ({
  id,
  refresh,
  userName,
  userEmail,
}: ViewProfileBtnProps) => {
  const [slowTransitionOpened, setSlowTransitionOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const responseSkills = await getSkillsByUserId(id);
      setSkills(responseSkills);

      //   setSkills([
      //     {
      //       skillName: "JavaScript",
      //       skillCategory: "Programming Language",
      //       skillDescription: "A high-level programming language.",
      //       skillExperience: "5 years",
      //       skillLevel: "Expert",
      //     },
      //     {
      //       skillName: "JavaScript",
      //       skillCategory: "Programming Language",
      //       skillDescription: "A high-level programming language.",
      //       skillExperience: "5 years",
      //       skillLevel: "Expert",
      //     },
      //     {
      //       skillName: "JavaScript",
      //       skillCategory: "Programming Language",
      //       skillDescription: "A high-level programming language.",
      //       skillExperience: "5 years",
      //       skillLevel: "Expert",
      //     },
      //   ]);

      setLoading(false);
    };
    fetchData();
  }, [refresh]);
  return (
    <div>
      <Tooltip label="View profile" color="dark" withArrow closeDelay={30}>
        <ActionIcon
          variant="subtle"
          color="dark"
          onClick={() => {
            setSlowTransitionOpened(true);
            setLoading(true);
            setTimeout(() => setLoading(false), 350);
          }}
        >
          <IconUserCircle
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        </ActionIcon>
      </Tooltip>
      <Modal.Root
        opened={slowTransitionOpened}
        onClose={() => {
          setSlowTransitionOpened(false);
        }}
        transitionProps={{ transition: "rotate-left" }}
      >
        <Modal.Overlay />

        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Title order={3}>Profile</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            {loading === true ? (
              <Box>
                <Group mb={20}>
                  <Skeleton height={50} circle />
                  <Stack>
                    <Skeleton height={8} width={200} />
                    <Skeleton height={8} width="90%" />
                  </Stack>
                </Group>
                <Skeleton height={20} width="25%" radius="xl" />
                <Skeleton height={12} mt={6} radius="xl" mb={15} />

                <Skeleton height={20} width="25%" radius="xl" />
                <Skeleton height={12} width="40%" mt={6} radius="xl" />
              </Box>
            ) : (
              <Box mb={10}>
                <Group>
                  <Avatar
                    variant="filled"
                    radius="xl"
                    color="blue"
                    //src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                  />
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      {userName}
                    </Text>

                    <Text c="dimmed" size="xs">
                      {userEmail}
                    </Text>
                  </div>
                </Group>
                <Title order={4} mt={20}>
                  Roles:
                </Title>
                <Badge variant="outline" color="dark" size="sm">
                  Employee
                </Badge>
                <Title order={4} mt={10}>
                  Skills:
                </Title>
                {skills ? (
                  <ScrollArea.Autosize
                    mah={400}
                    maw="100%"
                    mx="auto"
                    type="auto"
                    mt={10}
                  >
                    {skills.map((skill, index) => (
                      <SkillCard key={index} skill={skill} />
                    ))}
                  </ScrollArea.Autosize>
                ) : (
                  <Text fs="italic">No skills assigned</Text>
                )}
              </Box>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default ViewProfileBtn;
