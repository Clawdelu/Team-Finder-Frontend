// import { useDeleteState } from "@/app/lib/tables/TeamRolesTable";
import { updateTeamRole } from "@/app/api-services/teamRolesServices";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  Title,
  Button,
  Tooltip,
  ActionIcon,
  rem,
  TextInput,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { UUID } from "crypto";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  roleInProject: z.string().min(2),
});

type TeamRole = z.infer<typeof schema>;

type ModalEditTeamRoleProps = {
  id: UUID;
  roleInProject: string;
  // refresh: () => void;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  // onRefresh(active: boolean): void;
  // onSubmit: (id: string, data: TeamRole) => Promise<void>; // onSubmit function prop
};

const ModalEditTeamRole = ({
  id,
  roleInProject,
  refresh,
  setRefresh,
}: ModalEditTeamRoleProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TeamRole>({ resolver: zodResolver(schema) });

  const OnSubmit: SubmitHandler<TeamRole> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await updateTeamRole(id, data);
      console.log("Updated successful", response);
      close();
      setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to authenticate. Please check your credentials.",
      });
    }
  };

  useEffect(() => {
    if (roleInProject) {
      setValue("roleInProject", roleInProject);
    }
  }, [roleInProject, setValue]);

  return (
    <div>
      <Tooltip label="Update" color="blue" withArrow closeDelay={30}>
        <ActionIcon variant="subtle" color="blue" onClick={open}>
          <IconPencil
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        </ActionIcon>
      </Tooltip>

      <Modal.Root opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Title order={3}>Update Team Roles</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            {/* <Text c="dimmed" size="sm">
              Make changes to your team role here. Click save when you're done.
            </Text> */}
            <form onSubmit={handleSubmit(OnSubmit)}>
              <TextInput
                {...register("roleInProject")}
                label="New name"
                placeholder={roleInProject}
                //placeholder="e.g. Frontend Developer, Scrum Master, UX Designer"
                description="Make changes to your team role here. Click save when you're done."
                //value={roleInProject}
              />
              {errors.roleInProject && (
                <Text c="red">{errors.roleInProject.message}</Text>
              )}
              <Button type="submit" mt={30} mb={5} loading={isSubmitting}>
                Save changes
              </Button>
              {errors.root && <Text c="red">{errors.root.message}</Text>}
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default ModalEditTeamRole;
