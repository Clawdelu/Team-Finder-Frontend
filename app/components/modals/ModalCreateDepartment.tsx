import { createDepartment } from "@/app/api-services/departmentServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, rem, Text, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  departmentName: z.string().min(2),
});

type TeamRole = z.infer<typeof schema>;

type ModalCreateNewRoleProps = {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};

const ModalCreateDepartment = ({
  refresh,
  setRefresh,
}: ModalCreateNewRoleProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeamRole>({ resolver: zodResolver(schema) });

  const OnSubmit: SubmitHandler<TeamRole> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await createDepartment(data);
      console.log("Created successful", response);
      close();
      reset();
      setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to create a department. Please try again.",
      });
    }
  };

  return (
    <div>
      <Button
        rightSection={
          <IconPlus style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        }
        variant="outline"
        onClick={open}
      >
        New department
      </Button>

      <Modal.Root opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Title order={3}>Create a department</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(OnSubmit)}>
              <TextInput
                {...register("departmentName")}
                label="Name of department"
                description="Enter the name of the deparment. Click create when you're done."
              />
              {errors.departmentName && (
                <Text c="red">{errors.departmentName.message}</Text>
              )}
              <Button type="submit" mt={30} mb={5} loading={isSubmitting}>
                Create
              </Button>
              {errors.root && <Text c="red">{errors.root.message}</Text>}
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default ModalCreateDepartment;
