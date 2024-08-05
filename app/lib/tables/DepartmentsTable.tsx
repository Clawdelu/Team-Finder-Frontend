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
import { UUID } from "crypto";
import {
  deleteDepartment,
  Department,
  getAllDepartments,
} from "@/app/api-services/departmentServices";
import ModalEditDepartment from "@/app/components/modals/ModalEditDepartment";
import ModalDeleteDepartment from "@/app/components/modals/ModalDeleteDepartment";
import ModalCreateDepartment from "@/app/components/modals/ModalCreateDepartment";
import ModalAssignManagerDepartment from "@/app/components/modals/ModalAssignManagerDepartment";

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

function filterData(data: Department[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key]?.toString().toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: Department[],
  payload: {
    sortBy: keyof Department | null;
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

export function DepartmentsTable() {
  const [data, setData] = useState<Department[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<Department[]>([]);
  const [sortBy, setSortBy] = useState<keyof Department | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const departments = await getAllDepartments();
      setLoading(false);
      console.log("Departments:", departments);
      setData(departments || []);
      setSortedData(departments || []);
    };
    fetchData();
  }, [refresh]);

  const setSorting = (field: keyof Department) => {
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
    const success = await deleteDepartment(id);
    if (success) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setRefresh(!refresh);
    }
  };

  const rows = sortedData.map((department) => (
    <Table.Tr key={department.id} className={classes.rand}>
      <Table.Td>{department.departmentName}</Table.Td>
      <Table.Td>
        <Group gap={3} justify="flex-end">
          <ModalEditDepartment
            id={department.id}
            initialDepartmentName={department.departmentName}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          <ModalAssignManagerDepartment
            id={department.id}
            departmentName={department.departmentName}
            assignedManager={department.departmentManager}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          <ModalDeleteDepartment
            id={department.id}
            onDeleteRole={handleDelete}
          />
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
                sorted={sortBy === "departmentName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("departmentName")}
              >
                Department Name
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
        <ModalCreateDepartment refresh={refresh} setRefresh={setRefresh} />
      </Box>
    </div>
  );
}
