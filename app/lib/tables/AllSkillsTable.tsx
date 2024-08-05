"use client";
import { getSkills, Skill } from "@/app/api-services/skillServices";
import ModalAssignSkillToEmp from "@/app/components/modals/ModalAssignSkillToEmp";
import {
  Badge,
  Center,
  Group,
  LoadingOverlay,
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

interface SkillAssignment1 {
  name: string;
  category: string;
  departments: string[];
}

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

function filterData(data: Skill[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.keys(item).some((key) =>
      item[key as keyof Skill]?.toString().toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: Skill[],
  payload: {
    sortBy: keyof Skill | null;
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
      if (sortBy === "departments") return 0; // Skip sorting by departments
      if (payload.reversed) {
        return b[sortBy]!.toString().localeCompare(a[sortBy]!.toString());
      }

      return a[sortBy]!.toString().localeCompare(b[sortBy]!.toString());
    }),
    payload.search
  );
}
type AllSkillsTableProps = {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};
export function AllSkillsTable({ refresh, setRefresh }: AllSkillsTableProps) {
  const [data, setData] = useState<Skill[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<Skill[]>([]);
  const [sortBy, setSortBy] = useState<keyof Skill | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const skillAssignments = await getSkills();
      //console.log(skillAssignments);
      setLoading(false);
      setData(skillAssignments || []);
      setSortedData(skillAssignments || []);
    };
    fetchData();
    //console.log("`Am intrat in all skills PRIMUL");
  }, [refresh]);

  const setSorting = (field: keyof Skill) => {
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

  const rows = sortedData.map((assignment) => (
    <Table.Tr key={assignment.id} className={classes.rand}>
      <Table.Td>{assignment.skillName}</Table.Td>
      <Table.Td>{assignment.skillCategory.skillCategoryName}</Table.Td>
      <Table.Td>
        {assignment.departments.length > 0 ? (
          assignment.departments.map((d, index) => (
            <Badge key={index} variant="outline" mr={10} mb={3}>
              {d.departmentName}
            </Badge>
          ))
        ) : (
          <Badge variant="filled" mr={10} mb={3} color="red">
            No department
          </Badge>
        )}
      </Table.Td>
      <Table.Td>
        <ModalAssignSkillToEmp
          skillId={assignment.id}
          skillName={assignment.skillName}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <TextInput
        placeholder="Search by any name"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
        mt="lg"
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
                sorted={sortBy === "skillName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("skillName")}
              >
                Name
              </Th>
              <Th
                sorted={sortBy === "skillCategory"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("skillCategory")}
              >
                Category
              </Th>
              <Table.Th>Departments</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3}>
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
