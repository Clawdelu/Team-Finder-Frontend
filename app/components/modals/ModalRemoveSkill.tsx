"use client";
import { removeSkillFromDepartment } from "@/app/api-services/skillServices";

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
import { IconMinus, IconTrashX } from "@tabler/icons-react";
import { UUID } from "crypto";
type ModalRemoveSkillProps = {
  id: UUID;
  skillName: string;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};
const ModalRemoveSkill = ({
  id,
  refresh,
  setRefresh,
  skillName,
}: ModalRemoveSkillProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const handleDelete = async () => {
    try {
      const succes = await removeSkillFromDepartment(id);
      // const response = await getSkills();
      // console.log("response skill:", response);
      close();
      setRefresh(!refresh);
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };
  return (
    <div>
      <Tooltip
        label="Remove skill from your department"
        color="gray"
        withArrow
        closeDelay={30}
      >
        <ActionIcon variant="subtle" color="gray" onClick={open}>
          <IconMinus style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <Title order={3} mt={10} mb={10}>
          Remove skill from your department
        </Title>

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

export default ModalRemoveSkill;
