import {
  createProject,
  ProjectTeamRoleDto,
  ProjectUpdate,
  TechnologyStackDto,
} from "@/app/api-services/projectServices";
import { getTeamRoles } from "@/app/api-services/teamRolesServices";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  NumberInput,
  rem,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useCounter, useDisclosure } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const localDateValidator = z
  .string()
  .refine(
    (date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date)),
    {
      message: "Invalid date format. Expected yyyy-MM-dd",
    }
  );
const technologyStackDto = z.array(
  z.object({
    technologyName: z.string(),
  })
);
const projectTeamRoleDto = z.array(
  z.object({
    teamRoleId: z.string().uuid(),
    noOfMembers: z.number(),
  })
);

const schema = z
  .object({
    projectName: z.string().min(2),
    projectPeriod: z.string(),
    startDate: z.string(),
    deadlineDate: z.string().optional(),
    projectStatus: z.string(),
    generalDescription: z.string().min(1),
    technologyName: z.string(),
    teamRoleId: z.string(),
    noOfMembers: z.number(),
  })
  .refine(
    (data) => {
      if (data.projectPeriod === "FIXED") {
        return data.deadlineDate !== undefined && data.deadlineDate !== "";
      }
      return true;
    },
    {
      message: "Deadline date is required if the project period is FIXED",
      path: ["deadlineDate"],
    }
  )
  .transform((data) => ({
    ...data,
    deadlineDate:
      data.deadlineDate === undefined || data.deadlineDate === null
        ? ""
        : data.deadlineDate,
  }));

type Project = z.infer<typeof schema>;

type ModalCreateProjectProps = {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};

const ModalCreateProject = ({
  refresh,
  setRefresh,
}: ModalCreateProjectProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Project>({ resolver: zodResolver(schema) });
  const projectPeriod = watch("projectPeriod");
  const [teamRoles, setTeamRoles] =
    useState<{ value: string; label: string }[]>();
  const [count, setCount] = useCounter(0, { min: 0 });
  const [count1, setCount1] = useCounter(0, { min: 0 });
  const [technologyNames, setTechnologyNames] = useState(Array(count).fill(""));
  const [teamRolesRowsData, setTeamRolesRowsData] = useState(
    Array(count1).fill({ role: "", noOfMembers: 0 })
  );

  const handleInputChange = (index: number, value: string) => {
    const newTechnologyNames = [...technologyNames];
    newTechnologyNames[index] = value;
    // console.log("tech index: ", index);
    // console.log("tech value: ", value);
    // console.log("newTechnologyNames: ", newTechnologyNames);
    // console.log("technologyNames: ", technologyNames);
    setTechnologyNames(newTechnologyNames);
  };

  const handleTeamRolesChange = (index: number, value: any) => {
    // console.log("teamRole index: ", index);
    //console.log("teamRole value: ", value);
    const newTeamRolesRows = [...teamRolesRowsData];

    if (value !== null) newTeamRolesRows[index].role = value;
    else if (value === null) newTeamRolesRows[index].role = "";

    //console.log("newTeamRolesRows:", newTeamRolesRows);
    //console.log("teamRolesRowsData:", teamRolesRowsData);
    setTeamRolesRowsData(newTeamRolesRows);
  };

  useEffect(() => {
    setTeamRolesRowsData((prevData) => {
      const newData = [...prevData];
      while (newData.length < count1) {
        newData.push({ role: "", noOfMembers: 0 });
      }
      while (newData.length > count1) {
        newData.pop();
      }
      return newData;
    });
  }, [count1]);

  const handleNoOfMembersChange = (index: number, value: number) => {
    const newTeamRolesRows = [...teamRolesRowsData];
    newTeamRolesRows[index].noOfMembers = value;
    setTeamRolesRowsData(newTeamRolesRows);
  };

  const handleTEST = async () => {
    let test: ProjectUpdate = {
      projectName: "Example Project",
      projectPeriod: "FIXED",
      startDate: "2023-06-14",
      deadlineDate: "2023-07-14",
      projectStatus: "NOT_STARTED",
      generalDescription: "A project example",
      technologyStack: [{ technologyName: "React" }],
      teamRoles: [
        {
          teamRoleId: "11e18822-898a-49fa-9aee-447fcea6f0a0",
          noOfMembers: 5,
        },
      ],
    };
    const res = await createProject(test);
    console.log("CREATED:", res);
    close();
    setRefresh(!refresh);
  };
  const technologyStackRows = Array(count)
    .fill(0)
    .map((_, index) => (
      <Group key={index}>
        <TextInput
          key={index}
          onChange={(e) => handleInputChange(index, e.target.value)}
          style={{ flex: 1 }}
          placeholder="Name"
        />
        <ActionIcon variant="subtle" color="dark" onClick={setCount.decrement}>
          <IconTrash style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        </ActionIcon>
      </Group>
    ));

  const teamRolesRows = Array(count1)
    .fill(0)
    .map((_, index) => (
      <Group key={index}>
        <Select
          onChange={(value) => handleTeamRolesChange(index, value?.toString())}
          placeholder="Select one"
          data={teamRoles}
          searchable
          nothingFoundMessage="Nothing found..."
          allowDeselect={false}
        />
        <NumberInput
          onChange={(value) => handleNoOfMembersChange(index, Number(value))}
          clampBehavior="strict"
          min={0}
          max={20}
          defaultValue={0}
        />
        <ActionIcon variant="subtle" color="dark" onClick={setCount1.decrement}>
          <IconTrash style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        </ActionIcon>
      </Group>
    ));

  const OnSubmit: SubmitHandler<Project> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      console.log("Datele din form", data);
      console.log("tchNAME:", technologyNames);
      // console.log("roles:", teamRolesRowsData);

      let myProject: ProjectUpdate = {
        projectName: data.projectName,
        projectPeriod: data.projectPeriod,
        startDate: data.startDate,
        deadlineDate: data.deadlineDate,
        projectStatus: data.projectStatus,
        generalDescription: data.generalDescription,
        technologyStack: [],
        teamRoles: [],
      };
      let techNames: TechnologyStackDto[] = [
        { technologyName: data.technologyName },
      ];

      for (const obiect of technologyNames) {
        let techName: TechnologyStackDto = {
          technologyName: obiect,
        };
        if (techName.technologyName.trim() !== "") techNames.push(techName);
      }
      //console.log("TECH NAMES: ", techNames);
      console.log("aici");

      let teamRoles: ProjectTeamRoleDto[] = [
        { teamRoleId: data.teamRoleId, noOfMembers: data.noOfMembers },
      ];

      for (const obiect of teamRolesRowsData) {
        let teamRole: ProjectTeamRoleDto = {
          teamRoleId: obiect.role,
          noOfMembers: obiect.noOfMembers,
        };
        if (teamRole.teamRoleId.trim() !== "") teamRoles.push(teamRole);
      }
      // console.log("teamRoles: ", teamRoles);

      myProject.technologyStack = techNames;
      myProject.teamRoles = teamRoles;
      //if(myProject.deadlineDate === "")
      console.log("My Project:", myProject);
      const response = await createProject(myProject);
      console.log("Created successful", response);
      close();
      reset();
      setCount.set(0);
      setTechnologyNames(Array(count).fill(""));
      setCount1.set(0);
      setTeamRolesRowsData(Array(count1).fill({ role: "", noOfMembers: 0 }));
      setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to create a skill. Please try again.",
      });
    }
  };

  useEffect(() => {
    const fetchTeamRoleData = async () => {
      const teamRoles = await getTeamRoles();
      setTeamRoles(
        teamRoles?.map((teamRole) => ({
          value: teamRole.id,
          label: teamRole.roleInProject,
        }))
      );
    };
    fetchTeamRoleData();
  }, [refresh]);

  return (
    <div>
      <Button
        rightSection={
          <IconPlus style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        }
        variant="outline"
        onClick={open}
        mt="lg"
      >
        New Project
      </Button>

      <Modal.Root opened={opened} onClose={close} size="auto">
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Title order={3}>Create a project</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(OnSubmit)}>
              <Group mt="md" align="top">
                <Stack gap={0}>
                  <TextInput
                    {...register("projectName")}
                    label="Project name"
                    placeholder="Name"
                  />
                  {errors.projectName && (
                    <Text c="red">{errors.projectName.message}</Text>
                  )}
                </Stack>
                <Stack gap={0}>
                  <Select
                    onChange={(value) =>
                      setValue("projectPeriod", value || "FIXED")
                    }
                    label="Period"
                    placeholder="Select one"
                    data={[
                      { value: "FIXED", label: "Fixed" },
                      { value: "ONGOING", label: "Ongoing" },
                    ]}
                    searchable
                    nothingFoundMessage="Nothing found..."
                    allowDeselect={false}
                  />
                  {errors.projectPeriod && (
                    <Text c="red">{errors.projectPeriod.message}</Text>
                  )}
                </Stack>
              </Group>
              <Group mt="sm" __size={10}>
                <Stack gap={0}>
                  <DateInput
                    onChange={(value) =>
                      setValue(
                        "startDate",
                        value?.toISOString().slice(0, 10) || ""
                      )
                    }
                    label="Start date"
                    placeholder="Pick a date"
                    valueFormat="YYYY MMM DD"
                  />
                  {errors.startDate && (
                    <Text c="red">{errors.startDate.message}</Text>
                  )}
                </Stack>
                {projectPeriod === "FIXED" && (
                  <Stack gap={0}>
                    <DateInput
                      onChange={(value) =>
                        setValue(
                          "deadlineDate",
                          value?.toISOString().slice(0, 10) || ""
                        )
                      }
                      label="Deadline date"
                      placeholder="Pick a date"
                      valueFormat="YYYY MMM DD"
                    />
                    {errors.deadlineDate && (
                      <Text c="red">{errors.deadlineDate.message}</Text>
                    )}
                  </Stack>
                )}
              </Group>

              <Select
                onChange={(value) => setValue("projectStatus", value || "")}
                label="Status"
                placeholder="Select one"
                data={[
                  { value: "NOT_STARTED", label: "Not started" },
                  { value: "STARTING", label: "Starting" },
                ]}
                searchable
                nothingFoundMessage="Nothing found..."
                allowDeselect={false}
                mt="sm"
              />
              {errors.projectStatus && (
                <Text c="red">{errors.projectStatus.message}</Text>
              )}

              <Textarea
                {...register("generalDescription")}
                placeholder="About project"
                label="Description"
                autosize
                minRows={2}
                mt="sm"
              />
              {errors.generalDescription && (
                <Text c="red">{errors.generalDescription.message}</Text>
              )}

              <TextInput
                {...register("technologyName")}
                label="Technology Stack"
                placeholder="Name"
                mt="sm"
              />
              {errors.technologyName && (
                <Text c="red">{errors.technologyName.message}</Text>
              )}

              <Stack mt={3} gap={3}>
                {technologyStackRows}
              </Stack>
              <ActionIcon
                variant="filled"
                color="dark"
                onClick={setCount.increment}
                mt={3}
              >
                <IconPlus
                  style={{ width: rem(20), height: rem(20) }}
                  stroke={1.5}
                />
              </ActionIcon>
              <Stack gap={0}>
                <Group mt="sm" align="top">
                  <Stack gap={0}>
                    <Select
                      onChange={(value) => setValue("teamRoleId", value || "")}
                      label="Team roles"
                      placeholder="Select one"
                      data={teamRoles}
                      searchable
                      nothingFoundMessage="Nothing found..."
                      allowDeselect={false}
                    />
                    {errors.teamRoleId && (
                      <Text c="red">{errors.teamRoleId.message}</Text>
                    )}
                  </Stack>
                  <Stack gap={0}>
                    <NumberInput
                      onChange={(value) =>
                        setValue("noOfMembers", Number(value))
                      }
                      label="Number of members needed"
                      placeholder=""
                      clampBehavior="strict"
                      min={0}
                      max={100}
                      defaultValue={0}
                    />
                    {errors.noOfMembers && (
                      <Text c="red">{errors.noOfMembers.message}</Text>
                    )}
                  </Stack>
                </Group>
                <Stack mt={3} gap={3}>
                  {teamRolesRows}
                </Stack>
                <ActionIcon
                  variant="filled"
                  color="dark"
                  onClick={setCount1.increment}
                  mt={3}
                >
                  <IconPlus
                    style={{ width: rem(20), height: rem(20) }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Stack>

              <Button type="submit" mt={30} mb={5} loading={isSubmitting}>
                Submit
              </Button>
              {errors.root && <Text c="red">{errors.root.message}</Text>}
              {/* <Button mt={30} mb={5} onClick={handleTEST}>
                TEST
              </Button> */}
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default ModalCreateProject;
