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
  Badge,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import classes from "./UsersRolesSortTable.module.css";
import cx from "clsx";

import ModalAssignRoleUser from "@/app/components/modals/ModalAssignRoleUser";
import { getUsers, User } from "@/app/api-services/userService";

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
  // return data.filter((item) =>
  //   keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  // );
  return data.filter((item) =>
    keys(data[0]).some((key) => {
      const value = item[key];
      if (typeof value === "string") {
        return value.toLowerCase().includes(query);
      }
      return false;
    })
  );
}

function sortData(
  data: User[],
  payload: { sortBy: keyof User | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }
  if (sortBy === "roles") {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy]!.localeCompare(a[sortBy]!);
      }

      return a[sortBy]!.localeCompare(b[sortBy]!);
    }),
    payload.search
  );
}

export function UsersRolesSortTable() {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<keyof User | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const users = await getUsers();

      setLoading(false);
      //console.log("Users from effect:", users);
      setData(users || []);
      setSortedData(users || []);
    };
    fetchData();
  }, [refresh]);
  // console.log("afisez:", sortedData);

  const setSorting = (field: keyof User) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data || [], { sortBy: field, reversed, search }));
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

  //console.log("Roles: ", sortedData[0].roles);
  const rows = sortedData.map((row) => (
    <Table.Tr key={row.userName} className={classes.rand}>
      <Table.Td>{row.userName}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>
        {row.roles?.map((rol, index) => (
          <Badge key={index} variant="light" mr={10} mb={3}>
            {rol}
          </Badge>
        ))}
      </Table.Td>
      <Table.Td>
        <ModalAssignRoleUser
          id={row.id}
          initialRoles={row.roles}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    // <div style={{ maxWidth: "50em", backgroundColor: "#f0f0f0" }}>
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
        //h={500}
        mah={700}
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
          miw={700}
          layout="fixed"
        >
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Th
                sorted={sortBy === "userName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("userName")}
              >
                Name
              </Th>
              <Th
                sorted={sortBy === "email"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("email")}
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
    </div>
  );
}
