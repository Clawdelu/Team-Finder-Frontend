"use client";
import { useEffect, useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import classes from "./UsersRolesSortTable.module.css";
import cx from "clsx";
import ModalDeleteTeamRole from "@/app/components/modals/ModalDeleteTeamRole";
import ModalEditTeamRole from "@/app/components/modals/ModalEditTeamRole";
import {
  deleteTeamRole,
  getTeamRoles,
  TeamRole,
} from "@/app/api-services/teamRolesServices";
import { UUID } from "crypto";
import ModalCreateNewRole from "@/app/components/modals/ModalCreateNewRole";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: TeamRole[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(
  data: TeamRole[],
  payload: { sortBy: keyof TeamRole | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]!.toString());
      }

      return a[sortBy].localeCompare(b[sortBy]!.toString());
    }),
    payload.search
  );
}

export function TeamRolesTable() {
  const [data, setData] = useState<TeamRole[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<TeamRole[]>([]);
  const [sortBy, setSortBy] = useState<keyof TeamRole | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const roles = await getTeamRoles();
      // setTeamRolesList(roles);
      setLoading(false);
      console.log("Team roles:", roles);
      setData(roles || []);
      setSortedData(roles || []);
    };
    fetchData();
  }, [refresh]);

  const setSorting = (field: keyof TeamRole) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(
      sortData(sortedData || [], { sortBy: field, reversed, search })
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data || [], {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const handleDelete = async (id: UUID) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const success = await deleteTeamRole(id);
    if (success) setRefresh(!refresh);
    // setSortedData(sortedData?.filter((role) => role.id !== id) || []);
    //setSortedData((prev) => prev.filter((role) => role.id !== id));
  };

  const rows = sortedData.map((role) => (
    <Table.Tr key={role.id} className={classes.rand}>
      <Table.Td>{role.roleInProject}</Table.Td>
      <Table.Td>
        <Group gap={3} justify="flex-end">
          <ModalEditTeamRole
            id={role.id}
            roleInProject={role.roleInProject}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          <ModalDeleteTeamRole id={role.id} onDeleteRole={handleDelete} />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
      />
      <ScrollArea.Autosize
        mah={350}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={300}
          layout="fixed"
        >
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Th
                sorted={sortBy === "roleInProject"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("roleInProject")}
              >
                Name
              </Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea.Autosize>
      <Box mt={30}>
        <ModalCreateNewRole refresh={refresh} setRefresh={setRefresh} />
      </Box>
    </div>
  );
}
