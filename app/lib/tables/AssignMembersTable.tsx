"use client";
import { getAllUnasignedUsers, User } from "@/app/api-services/userService";
import AssignMemberBtn from "@/app/components/notif-button/AssignMemberBtn";
import ViewProfileBtn from "@/app/components/notif-button/ViewProfileBtn";
import {
  Badge,
  Box,
  Center,
  Group,
  keys,
  LoadingOverlay,
  Notification,
  rem,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import cx from "clsx";
import { useEffect, useState } from "react";
import classes from "./UsersRolesSortTable.module.css";

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

function filterData(data: User[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key]?.toString().toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: User[],
  payload: {
    sortBy: keyof User | null;
    reversed: boolean;
    search: string;
  }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy]!.toString().localeCompare(a[sortBy]!.toString());
      }

      return a[sortBy]!.toString().localeCompare(b[sortBy]!.toString());
    }),
    payload.search
  );
}

export function AssignMembersTable() {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<keyof User | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const users = await getAllUnasignedUsers();
      setLoading(false);
      setTimeout(() => setShowNotification(false), 8000);

      setData(users || []);
      setSortedData(users || []);
    };
    fetchData();
  }, [refresh]);

  const setSorting = (field: keyof User) => {
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

  const rows = sortedData.map((user) => (
    <Table.Tr key={user.id} className={classes.rand}>
      <Table.Td>{user.userName}</Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>
        {user.roles.map((role, index) => (
          <Badge key={index} variant="dot" mr={10} mb={3} size="sm">
            {role}
          </Badge>
        ))}
      </Table.Td>
      <Table.Td>
        <Group gap={3} justify="flex-end">
          <AssignMemberBtn
            id={user.id}
            refresh={refresh}
            setRefresh={setRefresh}
            setShowNotification={setShowNotification}
          />
          <ViewProfileBtn
            id={user.id}
            refresh={refresh}
            userName={user.userName}
            userEmail={user.email}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <TextInput
        mt={25}
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
        mah={600}
        //h={600}
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
                sorted={sortBy === "userName"} // Schimbat din departmentName în userName
                reversed={reverseSortDirection}
                onSort={() => setSorting("userName")} // Schimbat din departmentName în userName
              >
                Name
              </Th>
              <Th
                sorted={sortBy === "email"} // Adăugat pentru email
                reversed={reverseSortDirection}
                onSort={() => setSorting("email")} // Adăugat pentru email
              >
                Email
              </Th>
              <Table.Th>
                <Text fw={500} fz="sm">
                  Roles
                </Text>
              </Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea.Autosize>

      {showNotification && (
        <Box style={{ position: "fixed", bottom: rem(20), right: rem(10) }}>
          <Notification
            onClose={() => setShowNotification(false)}
            color="blue"
            title="Member Assigned Successfully"
          >
            The member has been successfully assigned to the department.
          </Notification>
        </Box>
      )}
    </div>
  );
}

export default AssignMembersTable;
