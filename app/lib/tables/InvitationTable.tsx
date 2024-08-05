"use client";
import {
  Badge,
  Box,
  Button,
  Group,
  LoadingOverlay,
  ScrollArea,
  Table,
} from "@mantine/core";
import { ButtonCopy } from "../button-copy/ButtonCopy";
import ModalDeleteInvite from "@/app/components/modals/ModalDeleteInvite";
import { useEffect, useState } from "react";
import {
  createInvite,
  getAllInivtes,
  Invite,
} from "@/app/api-services/inviteServices";
import { IconCirclePlus, IconPlus } from "@tabler/icons-react";
import InvitationLink from "@/app/components/InvitationLink";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function InvitationTable() {
  const [data, setData] = useState<Invite[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const invites = await getAllInivtes();

      setLoading(false);
      console.log("Invites:", invites);
      setData(invites || []);
    };
    fetchData();
  }, [refresh]);

  const handleCreateInvite = async () => {
    try {
      const response = await createInvite();
      setRefresh(!refresh);
    } catch (error) {
      console.log("Unexpected error handle:", error);
    }
  };
  const handleAddUser = async () => {
    try {
      let response = await createInvite();
      let inviteId = response?.id;

      router.push(`/${inviteId}/signup`);
    } catch (error) {
      console.log("Unexpected error handle:", error);
    }
  };

  const rows = data?.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <InvitationLink invitationId={item.id} />
      </Table.Td>

      <Table.Td>
        {item.available ? (
          <Badge fullWidth variant="light">
            Available
          </Badge>
        ) : (
          <Badge color="gray" fullWidth variant="light">
            Unavailable
          </Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Group>
          <ButtonCopy link={`http://localhost:3000/${item.id}/signup`} />
          <ModalDeleteInvite
            id={item.id}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      <ScrollArea
        h={600}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table.ScrollContainer minWidth={600}>
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Table verticalSpacing="xs" miw={700}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Invitation Link</Table.Th>

                <Table.Th>Status</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ScrollArea>
      <Group>
        <Button
          leftSection={<IconCirclePlus />}
          variant="outline"
          mt={20}
          onClick={handleCreateInvite}
        >
          Create an invite link
        </Button>
        <Button
          leftSection={<IconPlus />}
          variant="filled"
          mt={20}
          onClick={handleAddUser}
        >
          Add user
        </Button>
      </Group>
    </Box>
  );
}
