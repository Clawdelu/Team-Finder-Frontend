import { deleteInvite } from "@/app/api-services/inviteServices";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  rem,
  Title,
  Tooltip,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { UUID } from "crypto";
import React from "react";
type ModalDeleteInviteProps = {
  id: UUID;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};
const ModalDeleteInvite = ({
  id,
  refresh,
  setRefresh,
}: ModalDeleteInviteProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const handleDelete = async () => {
    try {
      const succes = await deleteInvite(id);

      close();
      setRefresh(!refresh);
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };
  return (
    <div>
      <Tooltip label="Delete" color="red" withArrow closeDelay={30}>
        <ActionIcon variant="subtle" color="red" onClick={open}>
          <IconTrash style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <Title order={3} mt={10} mb={10}>
          Are you absolutely sure?
        </Title>
        <Text size="sm" c="rgba(100,116,139,1)">
          This action cannot be undone. It will permanently delete the invite
          and remove it from our servers.
        </Text>
        <Group mt={20} justify="flex-end" gap="xs">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Delete</Button>
        </Group>
      </Modal>
    </div>
  );
};

export default ModalDeleteInvite;
