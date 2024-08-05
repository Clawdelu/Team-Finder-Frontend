// import { useDeleteState } from "@/app/lib/tables/TeamRolesTable";
import { updateDepartment } from "@/app/api-services/departmentServices";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Button,
  Modal,
  rem,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { UUID } from "crypto";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  departmentName: z.string().min(2),
});

type Department = z.infer<typeof schema>;

type ModalEditDepartmentProps = {
  id: UUID;
  initialDepartmentName: string;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};

const ModalEditDepartment = ({
  id,
  initialDepartmentName,
  refresh,
  setRefresh,
}: ModalEditDepartmentProps) => {
  const [departmentName, setDepartmentName] = useState(initialDepartmentName);
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Department>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset({ departmentName: initialDepartmentName });
    setDepartmentName(initialDepartmentName);
  }, [initialDepartmentName, reset]);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepartmentName(event.target.value);
  };

  const OnSubmit: SubmitHandler<Department> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await updateDepartment(id, data);
      console.log("Updated successful", response);
      close();
      setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to update the department. Please try again.",
      });
    }
  };

  return (
    <div>
      <Tooltip label="Update" color="blue" withArrow closeDelay={30}>
        <ActionIcon variant="subtle" onClick={open}>
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
              <Title order={3}>Update Department</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(OnSubmit)}>
              <TextInput
                {...register("departmentName")}
                label="New name"
                placeholder={departmentName}
                description="Make changes to your department here. Click save when you're done."
                value={departmentName}
                onChange={handleInputChange}
              />
              {errors.departmentName && (
                <Text c="red">{errors.departmentName.message}</Text>
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

export default ModalEditDepartment;
