"use client";
import { getAllCategories } from "@/app/api-services/categoryService";
import {
  filterSkillsByCategoryId,
  getSkills,
  getSkillsBySameAuthor,
  getSkillsBySameDepart,
  Skill,
} from "@/app/api-services/skillServices";
import ModalCreateSkill from "@/app/components/modals/ModalCreateSkill";

import ModalEditSkill from "@/app/components/modals/ModalEditSkill";
import {
  Box,
  Center,
  Divider,
  Group,
  keys,
  LoadingOverlay,
  MultiSelect,
  Notification,
  rem,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconFilter,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import cx from "clsx";
import { useEffect, useState } from "react";
import classes from "./UsersRolesSortTable.module.css";

import ModalAssignToDepart from "@/app/components/modals/ModalAssignToDepart";
import ModalDeleteSkill from "@/app/components/modals/ModalDeleteSkill";
import ModalRemoveSkill from "@/app/components/modals/ModalRemoveSkill";

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
    keys(data[0]).some((key) =>
      item[key]?.toString().toLowerCase().includes(query)
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
      if (payload.reversed) {
        return b[sortBy]!.toString().localeCompare(a[sortBy]!.toString());
      }

      return a[sortBy]!.toString().localeCompare(b[sortBy]!.toString());
    }),
    payload.search
  );
}

export function SkillsTable() {
  const [data, setData] = useState<Skill[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<Skill[]>([]);
  const [sortBy, setSortBy] = useState<keyof Skill | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [categoryDataFilter, setCategoryData] =
    useState<{ value: string; label: string }[]>();
  const [selectedCategoryValues, setSelectedCategoryValues] = useState<
    string[]
  >([]);

  const [enteredCategory, setEnteredCategory] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState(false);
  const [createdByFilter, setCreatedByFilter] = useState(false);
  const [valuesForRequest, setValuesForRequest] = useState<string[]>([]);

  useEffect(() => {
    const applyFiltersAsync = async () => {
      await applyFilters();
    };
    applyFiltersAsync();
  }, [enteredCategory && valuesForRequest, departmentFilter, createdByFilter]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const skills = await getSkills();
      setLoading(false);
      setTimeout(() => setShowNotification(false), 8000);

      setData(skills || []);
      setSortedData(skills || []);
    };

    const fetchCategoryData = async () => {
      const category = await getAllCategories();
      setCategoryData(
        category?.map((category) => ({
          value: category.id,
          label: category.skillCategoryName,
        }))
      );
    };
    fetchCategoryData();
    fetchData();
  }, [refresh]);

  const handleMultiSelectChange = async (values: string[]) => {
    setSelectedCategoryValues(values);

    if (values && values.length > 0) {
      setEnteredCategory(true);
      setValuesForRequest(values);
    } else {
      setEnteredCategory(false);
    }

    //await applyFilters();
  };

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
  function elementeComune(
    lista1: Skill[],
    lista2?: Skill[],
    lista3?: Skill[]
  ): Skill[] {
    if (lista1.length === 0) {
      return []; // Dacă prima listă e goală, returnăm o listă goală
    }

    // Folosim Set-uri pentru ID-urile din listele transmise
    const set1 = new Set(lista1.map((skill) => skill.id));
    const set2 = lista2 ? new Set(lista2.map((skill) => skill.id)) : null;
    const set3 = lista3 ? new Set(lista3.map((skill) => skill.id)) : null;

    // Găsim elementele comune între Set-uri
    const commonIds: string[] = [];
    set1.forEach((id) => {
      const inSet2 = set2 ? set2.has(id) : true;
      const inSet3 = set3 ? set3.has(id) : true;

      if (inSet2 && inSet3) {
        commonIds.push(id);
      }
    });

    // Returnăm obiectele Skill corespunzătoare ID-urilor comune
    return lista1.filter((skill) => commonIds.includes(skill.id));
  }
  const applyFilters = async () => {
    let filteredData: Skill[] = [];
    let lista1: Skill[] = [];
    let lista2: Skill[] = [];
    let lista3: Skill[] = [];
    //console.log("stari: ", enteredCategory, departmentFilter, createdByFilter);
    const skillIds = new Set();
    if (enteredCategory) {
      let filterCat: Skill[] = [];

      // console.log("a intrat aici:", filteredDataByCategory);
      for (const value of valuesForRequest) {
        const response = await filterSkillsByCategoryId(value);
        if (response) lista1.push(...response);
      }
      // for (const skill of filterCat) {
      //   if (!skillIds.has(skill.id)) {
      //     skillIds.add(skill.id);
      //     filteredData.push(skill);
      //   }
      // }

      // console.log("applyFilters filterCat: ", filterCat);
      // filteredData.push(...filterCat);
      // console.log("applyFilters filteredData: ", filteredData);
    }

    if (departmentFilter) {
      const response = await getSkillsBySameDepart();
      //console.log("departmentFilter:", response);
      if (response) lista2.push(...response);

      // if (departData)
      //   for (const skill of departData) {
      //     if (skillIds.has(skill.id)) {
      //       skillIds.add(skill.id);
      //       filteredData.push(skill);
      //     }
      //   }
      //console.log("departData", departData);
      //if (departData) filteredData.push(...departData);
    }

    if (createdByFilter) {
      const response = await getSkillsBySameAuthor();
      if (response) lista3.push(...response);
      //console.log("Skill by same:", lista3);
      // if (createdByData)
      //   for (const skill of createdByData) {
      //     if (!skillIds.has(skill.id)) {
      //       skillIds.add(skill.id);
      //       filteredData.push(skill);
      //     }
      //   }
      // console.log("createdByData", createdByData);
      // if (createdByData) {
      //   filteredData.push(...createdByData);
      // }
    }

    //console.log("Filtered data:", filteredData);
    if (enteredCategory && !departmentFilter && !createdByFilter) {
      filteredData = elementeComune(lista1);
      //console.log("enteredCategory!!!");
    } else if (enteredCategory && departmentFilter && !createdByFilter) {
      //console.log("enteredCategory && departmentFilter!!!");
      filteredData = elementeComune(lista1, lista2);
    } else if (enteredCategory && createdByFilter && !departmentFilter) {
      //console.log("enteredCategory && createdByFilter!!!");
      filteredData = elementeComune(lista1, lista3);
    } else if (departmentFilter && createdByFilter && !enteredCategory) {
      //console.log("departmentFilter && createdByFilter!!!");
      filteredData = elementeComune(lista2, lista3);
    } else if (departmentFilter && !createdByFilter && !enteredCategory) {
      // console.log("departmentFilter!!!");
      filteredData = elementeComune(lista2);
    } else if (createdByFilter && !departmentFilter && !enteredCategory) {
      // console.log("createdByFilter!!!");
      filteredData = elementeComune(lista3);
    } else if (createdByFilter && departmentFilter && enteredCategory) {
      // console.log("createdByFilter && departmentFilter && enteredCategory!!!");
      filteredData = elementeComune(lista1, lista2, lista3);
    }

    if (enteredCategory || departmentFilter || createdByFilter)
      setSortedData(filteredData);
    else if (data) setSortedData(data);
  };

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
  //   const [opened, setOpened] = useState(false);
  //   const handlerOpneMenu = () => {
  //     setOpened(true);
  //   };
  const rows = sortedData.map((skill) => (
    <Table.Tr key={skill.id} className={classes.rand}>
      <Table.Td>{skill.skillName}</Table.Td>
      <Table.Td>{skill.skillCategory.skillCategoryName}</Table.Td>
      <Table.Td>{skill.description}</Table.Td>
      <Table.Td>
        <Group>
          <ModalAssignToDepart
            id={skill.id}
            refresh={refresh}
            setRefresh={setRefresh}
            skillName={skill.skillName}
          />
          <ModalRemoveSkill
            id={skill.id}
            refresh={refresh}
            setRefresh={setRefresh}
            skillName={skill.skillName}
          />
          <ModalEditSkill
            id={skill.id}
            skillUpdate={skill}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          <ModalDeleteSkill
            id={skill.id}
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
          // label="Category"
          placeholder="Category"
          data={categoryDataFilter}
          checkIconPosition="right"
          clearable
          searchable
          nothingFoundMessage="Nothing found..."
          onChange={handleMultiSelectChange}
          value={selectedCategoryValues}
          leftSection={
            <IconFilter
              stroke={1}
              style={{ width: rem(16), height: rem(16) }}
            />
          }
        />
        <Select
          placeholder="Your department"
          leftSection={
            <IconFilter
              stroke={1}
              style={{ width: rem(16), height: rem(16) }}
            />
          }
          data={["Skills in your department"]}
          clearable
          onChange={handleDepartmentChange}
        />
        <Select
          placeholder="Created by you"
          leftSection={
            <IconFilter
              stroke={1}
              style={{ width: rem(16), height: rem(16) }}
            />
          }
          data={["Created by you"]}
          clearable
          onChange={handleCreatedByChange}
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
                sorted={sortBy === "skillName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("skillName")}
              >
                Skill Name
              </Th>
              <Th
                sorted={sortBy === "skillCategory"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("skillCategory")}
              >
                Skill Category
              </Th>
              <Th
                sorted={sortBy === "description"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("description")}
              >
                Skill Description
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

      <ModalCreateSkill refresh={refresh} setRefresh={setRefresh} />

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

export default SkillsTable;
