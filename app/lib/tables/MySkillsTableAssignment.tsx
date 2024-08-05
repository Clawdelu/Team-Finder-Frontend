"use client";
import { getMySkills, MySkillsDetail } from "@/app/api-services/userService";
import ModalRemoveSkillFromUser from "@/app/components/modals/ModalRemoveSkillFromUser";
import {
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

function filterData(data: MySkillsDetail[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key]?.toString().toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: MySkillsDetail[],
  payload: {
    sortBy: keyof MySkillsDetail | null;
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
type MySkillsTableAssignmentProps = {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};
export function MySkillsTableAssignment({
  refresh,
  setRefresh,
}: MySkillsTableAssignmentProps) {
  const [data, setData] = useState<MySkillsDetail[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<MySkillsDetail[]>([]);
  const [sortBy, setSortBy] = useState<keyof MySkillsDetail | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const skills = await getMySkills();
      setLoading(false);
      setTimeout(() => setShowNotification(false), 8000);

      setData(skills || []);
      setSortedData(skills || []);
    };

    fetchData();
    // console.log("`Am intrat in my skills AL DOILEA");
  }, [refresh]);

  const setSorting = (field: keyof MySkillsDetail) => {
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
  const skillLevels = [
    { value: "LEARNS", label: "1 - Learns" },
    { value: "KNOWS", label: "2 - Knows" },
    { value: "DOES", label: "3 - Does" },
    { value: "HELPS", label: "4 - Helps" },
    { value: "TEACHES", label: "5 - Teaches" },
  ];
  const experienceLevels = [
    { value: "SIX_MONTHS", label: "0-6 months" },
    { value: "ONE_YEAR", label: "6-12 months" },
    { value: "TWO_YEARS", label: "1-2 years" },
    { value: "FOUR_YEARS", label: "2-4 years" },
    { value: "SEVEN_YEARS", label: "4-7 years" },
    { value: "MORE_THAN_7_YEARS", label: ">7 years" },
  ];
  function getLevelByValue(value: string): string | undefined {
    const skill = skillLevels.find((skill) => skill.value === value);
    return skill ? skill.label : undefined;
  }
  function getExpByValue(value: string): string | undefined {
    const experience = experienceLevels.find((exp) => exp.value === value);
    return experience ? experience.label : undefined;
  }
  const rows = sortedData.map((skill) => (
    <Table.Tr key={skill.id} className={classes.rand}>
      <Table.Td>{skill.skill.skillName}</Table.Td>
      <Table.Td>{getLevelByValue(skill.level)}</Table.Td>
      <Table.Td>{getExpByValue(skill.experience)}</Table.Td>
      <Table.Td>
        <Group>
          <ModalRemoveSkillFromUser
            id={skill.id}
            skillName={skill.skill.skillName}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
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
        mt="lg"
        mb="md"
      />

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
                sorted={sortBy === "skill"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("skill")}
              >
                Name
              </Th>
              <Th
                sorted={sortBy === "level"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("level")}
              >
                Level
              </Th>
              <Th
                sorted={sortBy === "experience"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("experience")}
              >
                Experience
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

      {showNotification && (
        <Box style={{ position: "fixed", bottom: rem(20), right: rem(10) }}>
          <Notification
            onClose={() => setShowNotification(false)}
            color="red"
            title="Skill Removed Successfully"
          >
            The skill has been successfully removed.
          </Notification>
        </Box>
      )}
    </div>
  );
}

export default MySkillsTableAssignment;
