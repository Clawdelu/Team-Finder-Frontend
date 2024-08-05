import {
  AssignmentUpdate,
  createAssignment,
} from "@/app/api-services/assignmentServices";
import {
  createDeallocation,
  DeallocationUpdate,
} from "@/app/api-services/deallocationServices";
import { Project } from "@/app/api-services/projectServices";
import { User } from "@/app/api-services/userService";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Modal,
  MultiSelect,
  Notification,
  NumberInput,
  rem,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  reason: z.string().min(2),
});

type DeallocationCreate = z.infer<typeof schema>;

type ModalCreateDeallocationProps = {
  // usersRefresh: User[];
  // setUsersRefresh: (value: User[]) => void;
  projectId: string;
  userId: string;
  userName: string;
};

const ModalCreateDeallocation = ({
  projectId,
  userId,
  userName,
}: ModalCreateDeallocationProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DeallocationCreate>({ resolver: zodResolver(schema) });

  const [showNotification, setShowNotification] = useState(false);

  const OnSubmit: SubmitHandler<DeallocationCreate> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      let deall: DeallocationUpdate = {
        deallocationReason: data.reason,
        userId: userId,
        projectId: projectId,
      };
      const response = await createDeallocation(deall);
      console.log("Created successful", response);
      console.log("deall", deall);
      if (response) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }

      close();
      reset();
      // setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to create a skill. Please try again.",
      });
    }
  };

  return (
    <div>
      <Button variant="default" onClick={open}>
        Create deallocation
      </Button>

      <Modal.Root opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Title order={3}>Propose deallocation for {userName}</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(OnSubmit)}>
              <Textarea
                {...register("reason")}
                placeholder="Type a reason why you no longer want this employee..."
                label="Deallocation reason"
                autosize
                minRows={2}
                mt="md"
              />
              {errors.reason && <Text c="red">{errors.reason.message}</Text>}

              <Button type="submit" mt={30} mb={5} loading={isSubmitting}>
                Create deallocation
              </Button>
              {errors.root && <Text c="red">{errors.root.message}</Text>}
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      {showNotification && (
        <Box style={{ position: "fixed", bottom: rem(20), right: rem(10) }}>
          <Notification
            onClose={() => setShowNotification(false)}
            color="Blue"
            title="Successfully created dealocation"
          ></Notification>
        </Box>
      )}
    </div>
  );
};

export default ModalCreateDeallocation;
