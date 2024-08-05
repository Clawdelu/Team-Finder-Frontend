import {
  AssignmentUpdate,
  createAssignment,
} from "@/app/api-services/assignmentServices";
import { Project } from "@/app/api-services/projectServices";
import { User } from "@/app/api-services/userService";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Modal,
  MultiSelect,
  NumberInput,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  workHours: z.number(),
  comments: z.string().min(2),
  teamRoleIds: z.array(z.string()),
});

type AssignmentCreate = z.infer<typeof schema>;

type ModalCreateProposeProps = {
  usersRefresh: User[];
  setUsersRefresh: (value: User[]) => void;
  project: Project;
  userId: string;
  userName: string;
};

const ModalCreatePropose = ({
  usersRefresh,
  setUsersRefresh,
  project,
  userId,
  userName,
}: ModalCreateProposeProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentCreate>({ resolver: zodResolver(schema) });

  const [teamRolesData, setTeamRolesData] =
    useState<{ value: string; label: string }[]>();

  const [selectedTeamRoles, setSelectedTeamRoles] = useState<string[]>([]);

  const OnSubmit: SubmitHandler<AssignmentCreate> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      let assign: AssignmentUpdate = {
        workHours: data.workHours,
        teamRoleIds: data.teamRoleIds,
        comments: data.comments,
        userId: userId,
        projectId: project.id,
      };
      const response = await createAssignment(assign);
      console.log("Created successful", response);
      console.log("assign", assign);
      //console.log("user id:", userId);
      setUsersRefresh(usersRefresh.filter((u) => u.id !== userId));
      close();
      reset();
      // setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to create a skill. Please try again.",
      });
    }
  };
  useEffect(() => {
    const fetchTeamRoles = async () => {
      setTeamRolesData(
        project.teamRoles?.map((teamRole) => ({
          value: teamRole.teamRole.id,
          label: teamRole.teamRole.roleInProject,
        }))
      );
    };
    fetchTeamRoles();
  }, [project]);

  const handleMultiSelectChange = async (values: string[]) => {
    setSelectedTeamRoles(values);
    setValue("teamRoleIds", values);
  };
  return (
    <div>
      <Button variant="default" onClick={open}>
        Propose
      </Button>

      <Modal.Root opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Title order={3}>Propose {userName}</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(OnSubmit)}>
              <NumberInput
                onChange={(value) => setValue("workHours", Number(value))}
                //value={watch("workHours")}
                label="Work hours"
                placeholder="Select work hours 1-8"
                min={1}
                max={8}
              />

              {errors.workHours && (
                <Text c="red">{errors.workHours.message}</Text>
              )}
              <MultiSelect
                mt="md"
                label="Team roles"
                placeholder="Select team roles from the list"
                data={teamRolesData}
                checkIconPosition="right"
                clearable
                searchable
                nothingFoundMessage="Nothing found..."
                onChange={handleMultiSelectChange}
                // value={selectedTeamRoles}
              />

              {errors.teamRoleIds && (
                <Text c="red">{errors.teamRoleIds.message}</Text>
              )}

              <Textarea
                {...register("comments")}
                placeholder="Leave some comments about this proposal"
                label="Comments"
                autosize
                minRows={2}
                mt="md"
              />
              {errors.comments && (
                <Text c="red">{errors.comments.message}</Text>
              )}

              <Button
                type="submit"
                mt={30}
                mb={5}
                loading={isSubmitting}
                onClick={() => {
                  console.log("hei", isSubmitting);
                }}
              >
                Propose
              </Button>
              {errors.root && <Text c="red">{errors.root.message}</Text>}
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default ModalCreatePropose;
