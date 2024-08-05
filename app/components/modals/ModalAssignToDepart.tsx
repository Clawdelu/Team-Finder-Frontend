"use client";
import { addSkillToDepartment } from "@/app/api-services/skillServices";

import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  rem,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { UUID } from "crypto";
type ModalAssignToDepartProps = {
  id: UUID;
  skillName: string;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};
const ModalAssignToDepart = ({
  id,
  refresh,
  setRefresh,
  skillName,
}: ModalAssignToDepartProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const handleAssign = async () => {
    try {
      await addSkillToDepartment(id);

      close();
      setRefresh(!refresh);
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };
  return (
    <div>
      <Tooltip
        label="Assign to department"
        color="gray"
        withArrow
        closeDelay={30}
      >
        <ActionIcon variant="subtle" color="gray" onClick={open}>
          <IconPlus style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <Title order={3} mt={10} mb={10}>
          Assign this skill to your department
        </Title>
        <Badge size="lg" color="indigo">
          {skillName}
        </Badge>
        <Group mt={20} justify="flex-end" gap="xs">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>Assign</Button>
        </Group>
      </Modal>
    </div>
  );
};

export default ModalAssignToDepart;
