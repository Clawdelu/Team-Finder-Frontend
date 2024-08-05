"use client";
import { removeSkillFromUser } from "@/app/api-services/userService";

import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  rem,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrashX } from "@tabler/icons-react";
import { UUID } from "crypto";
type ModalRemoveSkillFromUserProps = {
  id: UUID;
  skillName: string;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};
const ModalRemoveSkillFromUser = ({
  id,
  refresh,
  setRefresh,
  skillName,
}: ModalRemoveSkillFromUserProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const handleDelete = async () => {
    try {
      const succes = await removeSkillFromUser(id);

      close();
      setRefresh(!refresh);
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };
  return (
    <div>
      <Tooltip label="Remove skill" color="red" withArrow closeDelay={30}>
        <ActionIcon variant="subtle" color="red" onClick={open}>
          <IconTrashX
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        </ActionIcon>
      </Tooltip>

      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <Title order={3} mt={10} mb={10}>
          Are you absolutely sure?
        </Title>
        <Text size="sm" c="rgba(100,116,139,1)" mb="lg">
          You will no longer have this skill.
        </Text>
        <Badge size="lg" color="grape">
          {skillName}
        </Badge>
        <Group mt={20} justify="flex-end" gap="xs">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Remove</Button>
        </Group>
      </Modal>
    </div>
  );
};

export default ModalRemoveSkillFromUser;
