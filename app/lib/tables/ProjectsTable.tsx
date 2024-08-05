"use client";
import "@mantine/dates/styles.css";

import {
  ActionIcon,
  Box,
  Button,
  Center,
  Divider,
  Group,
  keys,
  LoadingOverlay,
  MultiSelect,
  Notification,
  rem,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconFileDescription,
  IconFilter,
  IconSearch,
  IconSelector,
  IconZoomCode,
} from "@tabler/icons-react";
import cx from "clsx";
import { useEffect, useState } from "react";
import classes from "./UsersRolesSortTable.module.css";

import {
  filterProjectsByPeriod,
  filterProjectsByStatus,
  getProjects,
  Project,
} from "@/app/api-services/projectServices";
import ModalCreateProject from "@/app/components/modals/ModalCreateProject";
import ModalDeleteProject from "@/app/components/modals/ModalDeleteProject";
import ModalEditProject from "@/app/components/modals/ModalEditProject";
import Link from "next/link";

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

function filterData(data: Project[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key]?.toString().toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: Project[],
  payload: {
    sortBy: keyof Project | null;
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

export function ProjectsTable() {
  const [data, setData] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<Project[]>([]);
  const [sortBy, setSortBy] = useState<keyof Project | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [selectedPeriod, setSelectedPeriod] = useState<string[]>([]);
  const [selectedStatus, setselectedStatus] = useState<string[]>([]);

  const [enteredPeriodFilter, setEnteredPeriodFilter] = useState(false);
  const [enteredStatusFilter, setEnteredStatusFilter] = useState(false);

  const [valuesForRequest, setValuesForRequest] = useState<string[]>([]);
  const [valuesForRequestStatus, setValuesForRequestStatus] = useState<
    string[]
  >([]);

  useEffect(() => {
    const applyFiltersAsync = async () => {
      await applyFilters();
    };
    applyFiltersAsync();
  }, [
    enteredPeriodFilter && valuesForRequest,
    enteredStatusFilter && valuesForRequestStatus,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const projects = await getProjects();
      setLoading(false);
      setTimeout(() => setShowNotification(false), 8000);

      setData(projects || []);
      setSortedData(projects || []);
    };

    fetchData();
  }, [refresh]);

  const handleMultiSelectChange = async (values: string[]) => {
    setSelectedPeriod(values);

    if (values.length > 0) {
      setEnteredPeriodFilter(true);
      setValuesForRequest(values);
    } else {
      setEnteredPeriodFilter(false);
    }
  };
  const handleStatusChange = async (values: string[]) => {
    setselectedStatus(values);

    if (values.length > 0) {
      setEnteredStatusFilter(true);
      setValuesForRequestStatus(values);
    } else {
      setEnteredStatusFilter(false);
    }
  };
  /*
  const handleDepartmentChange = async (value: string | null) => {
    if (value) setDepartmentFilter(true);
    else setDepartmentFilter(false);

    //await applyFilters();
  };

  const handleCreatedByChange = async (value: string | null) => {
    if (value) setCreatedByFilter(true);
    else setCreatedByFilter(false);
    // await applyFilters();
  };
  */
  function elementeComune(lista1: Project[], lista2?: Project[]): Project[] {
    if (lista1.length === 0) {
      return []; // Dacă prima listă e goală, returnăm o listă goală
    }

    // Folosim Set-uri pentru ID-urile din listele transmise
    const set1 = new Set(lista1.map((project) => project.id));
    const set2 = lista2 ? new Set(lista2.map((project) => project.id)) : null;

    // Găsim elementele comune între Set-uri
    const commonIds: string[] = [];
    set1.forEach((id) => {
      const inSet2 = set2 ? set2.has(id) : true;

      if (inSet2) {
        commonIds.push(id);
      }
    });

    // Returnăm obiectele Project corespunzătoare ID-urilor comune
    return lista1.filter((project) => commonIds.includes(project.id));
  }

  const applyFilters = async () => {
    let filteredData: Project[] = [];
    let lista1: Project[] = [];
    let lista2: Project[] = [];

    if (enteredPeriodFilter) {
      for (const value of valuesForRequest) {
        const response = await filterProjectsByPeriod(value);
        if (response) lista1.push(...response);
      }
    }

    if (enteredStatusFilter) {
      for (const value of valuesForRequestStatus) {
        const response = await filterProjectsByStatus(value);
        if (response) lista2.push(...response);
      }
    }

    //console.log("Filtered data:", filteredData);
    if (enteredPeriodFilter && !enteredStatusFilter)
      filteredData = elementeComune(lista1);
    else if (enteredStatusFilter && !enteredPeriodFilter)
      filteredData = elementeComune(lista2);
    else if (enteredPeriodFilter && enteredStatusFilter)
      filteredData = elementeComune(lista1, lista2);

    if (enteredPeriodFilter || enteredStatusFilter) setSortedData(filteredData);
    else if (data) setSortedData(data);
  };

  const setSorting = (field: keyof Project) => {
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

  const rows = sortedData.map((project) => (
    <Table.Tr key={project.id} className={classes.rand}>
      <Table.Td>{project.projectName}</Table.Td>
      <Table.Td>{project.projectPeriod}</Table.Td>
      <Table.Td>{project.startDate}</Table.Td>
      <Table.Td>{project.deadlineDate}</Table.Td>
      <Table.Td>{project.projectStatus}</Table.Td>
      <Table.Td>
        <Group>
          <Tooltip label="View Details" color="dark" withArrow closeDelay={30}>
            <ActionIcon
              variant="subtle"
              color="dark"
              component={Link}
              href={`/admin/projects/${project.id}`}
            >
              <IconFileDescription
                style={{ width: rem(20), height: rem(20) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Team finder" color="dark" withArrow closeDelay={30}>
            <ActionIcon
              variant="subtle"
              color="dark"
              component={Link}
              href={`/admin/projects/${project.id}/teamfinder`}
            >
              <IconZoomCode
                style={{ width: rem(20), height: rem(20) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
          <ModalEditProject
            project={project}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          <ModalDeleteProject
            id={project.id}
            refresh={refresh}
            setRefresh={setRefresh}
            setLoading={setLoading}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Group align="center" justify="flex-start" mt={25} mb="lg">
        <TextInput
          //label="Search"
          placeholder="Search by any field"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
        <Divider orientation="vertical" size="sm" />

        <MultiSelect
          placeholder="Period"
          data={[
            { value: "FIXED", label: "Fixed" },
            { value: "ONGOING", label: "Ongoing" },
          ]}
          checkIconPosition="right"
          clearable
          searchable
          nothingFoundMessage="Nothing found..."
          onChange={handleMultiSelectChange}
          value={selectedPeriod}
          leftSection={
            <IconFilter
              stroke={1}
              style={{ width: rem(16), height: rem(16) }}
            />
          }
        />
        <MultiSelect
          placeholder="Status"
          data={[
            { value: "NOT_STARTED", label: "Not started" },
            { value: "STARTING", label: "Starting" },
            { value: "IN_PROGRESS", label: "In Progress" },
            { value: "CLOSING", label: "Closing" },
            { value: "CLOSED ", label: "Closed" },
          ]}
          checkIconPosition="right"
          clearable
          searchable
          nothingFoundMessage="Nothing found..."
          onChange={handleStatusChange}
          value={selectedStatus}
          leftSection={
            <IconFilter
              stroke={1}
              style={{ width: rem(16), height: rem(16) }}
            />
          }
        />
      </Group>

      <ScrollArea.Autosize
        mah={600}
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
                sorted={sortBy === "projectName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("projectName")}
              >
                Name
              </Th>
              <Th
                sorted={sortBy === "projectPeriod"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("projectPeriod")}
              >
                Period
              </Th>
              <Th
                sorted={sortBy === "startDate"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("startDate")}
              >
                Start date
              </Th>
              <Th
                sorted={sortBy === "deadlineDate"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("deadlineDate")}
              >
                Deadline date
              </Th>
              <Th
                sorted={sortBy === "projectStatus"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("projectStatus")}
              >
                Status
              </Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea.Autosize>

      <ModalCreateProject refresh={refresh} setRefresh={setRefresh} />

      {showNotification && (
        <Box style={{ position: "fixed", bottom: rem(20), right: rem(10) }}>
          <Notification
            onClose={() => setShowNotification(false)}
            color="blue"
            title="Skill Added Successfully"
          >
            The skill has been successfully added.
          </Notification>
        </Box>
      )}
    </div>
  );
}

export default ProjectsTable;
