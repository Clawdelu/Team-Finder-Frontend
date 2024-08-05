import { updateDepartment } from "@/app/api-services/departmentServices";
import {
  getDepartmentManagers,
  getUserById,
} from "@/app/api-services/userService";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  Title,
  Button,
  Tooltip,
  ActionIcon,
  rem,
  Text,
  Badge,
  Group,
  Paper,
  NativeSelect,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUserPlus } from "@tabler/icons-react";
import { UUID } from "crypto";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  departmentName: z.string().min(2),
  departmentManager: z.string().min(2),
});

type Department = z.infer<typeof schema>;

type ModalAssignManagerDepartmentProps = {
  id: UUID;
  departmentName: string;
  assignedManager: UUID | null;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};

type DataNativeSelect = {
  label: string;
  value: UUID;
};

const ModalAssignManagerDepartment = ({
  id,
  departmentName,
  assignedManager,
  refresh,
  setRefresh,
}: ModalAssignManagerDepartmentProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataNativeSelect[]>();
  const [nameOfManager, setNameOfManager] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Department>({
    resolver: zodResolver(schema),
    defaultValues: { departmentName: departmentName },
  });
  const [managersState, setManagersState] = useState(false);

  const OnSubmit: SubmitHandler<Department> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await updateDepartment(id, data);
      console.log("Updated successful", response);
      //console.log("data:", data);
      close();
      setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to update the department. Please try again.",
      });
    }
  };

  useEffect(() => {
    const fetchDataForSelect = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const managers = await getDepartmentManagers();
      console.log("Managers:", managers);
      if (managers && managers.length > 0) {
        const managersName: DataNativeSelect[] = managers.map((manager) => ({
          label: manager.userName,
          value: manager.id,
        }));
        setData(managersName);
        setManagersState(true);
      } else {
        setManagersState(false);
        setData(undefined);
      }

      if (assignedManager != null) {
        const userById = await getUserById(assignedManager);
        setNameOfManager(userById?.userName);
      }

      setLoading(false);
    };
    fetchDataForSelect();
  }, [refresh]);

  return (
    <div>
      <Tooltip label="Assign manager" color="teal" withArrow closeDelay={30}>
        <ActionIcon variant="subtle" color="teal" onClick={open}>
          <IconUserPlus
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
              <Title order={3}>Assign a member to department</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Paper shadow="xs" withBorder p="sm">
              <Group>
                <Text size="lg" fw={500}>
                  Department:
                </Text>
                <Text>{departmentName}</Text>
              </Group>

              {assignedManager !== null ? (
                <Group>
                  <Text fw={500} size="lg">
                    Manager name:
                  </Text>
                  <Text>{nameOfManager}</Text>
                </Group>
              ) : (
                <Badge variant="outline" color="red" size="sm">
                  No manager assigned yet
                </Badge>
              )}
            </Paper>
            <form onSubmit={handleSubmit(OnSubmit)}>
              <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "xl", blur: 4 }}
                loaderProps={{ color: "blue", type: "bars" }}
              />
              {managersState ? (
                <NativeSelect
                  {...register("departmentManager")}
                  label="Assign manager"
                  data={data}
                  mt={25}
                />
              ) : (
                <NativeSelect
                  label="Assign manager"
                  data={["No manager is available"]}
                  mt={25}
                  defaultValue={"No manager is available"}
                  disabled
                />
              )}

              {errors.departmentManager && (
                <Text c="red">{errors.departmentManager.message}</Text>
              )}
              <Group mt={30} mb={5} justify="flex-end">
                <Button type="submit" loading={isSubmitting}>
                  Save
                </Button>
                <Button variant="default" onClick={close}>
                  Cancel
                </Button>
              </Group>
              {errors.root && <Text c="red">{errors.root.message}</Text>}
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default ModalAssignManagerDepartment;
