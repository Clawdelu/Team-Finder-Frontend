import { createDepartment } from "@/app/api-services/departmentServices";
import { assignSkillToUser } from "@/app/api-services/userService";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Button,
  Modal,
  rem,
  Select,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconTablePlus } from "@tabler/icons-react";
import { UUID } from "crypto";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  level: z.string().min(2),
  experience: z.string().min(2),
});

type UserSkill = z.infer<typeof schema>;

type ModalAssignSkillToEmpProps = {
  skillId: UUID;
  skillName: string;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};

const ModalAssignSkillToEmp = ({
  skillId,
  skillName,
  refresh,
  setRefresh,
}: ModalAssignSkillToEmpProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserSkill>({ resolver: zodResolver(schema) });

  const OnSubmit: SubmitHandler<UserSkill> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await assignSkillToUser(skillId, data);
      console.log("Assigned successful", response);
      close();
      reset();
      setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to assign a skill to you. Please try again.",
      });
    }
  };

  return (
    <div>
      <Tooltip
        label="Assign a skill to you"
        color="blue"
        withArrow
        closeDelay={30}
      >
        <ActionIcon variant="subtle" color="blue" onClick={open}>
          <IconTablePlus
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
              <Title order={3}>Assign skill</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(OnSubmit)}>
              <TextInput label="Skill" value={skillName} disabled mt="md" />

              <Select
                onChange={(value) => setValue("level", value || "")}
                label="Level"
                placeholder="Select a level according to your knowledge"
                data={[
                  { value: "LEARNS", label: "1 - Learns" },
                  { value: "KNOWS", label: "2  - Knows" },
                  { value: "DOES", label: "3 - Does" },
                  { value: "HELPS", label: "4 - Helps" },
                  { value: "TEACHES", label: "5 - Teaches" },
                ]}
                defaultValue="React"
                allowDeselect={false}
                mt="sm"
              />
              {errors.level && <Text c="red">{errors.level.message}</Text>}
              <Select
                onChange={(value) => setValue("experience", value || "")}
                label="Experience"
                placeholder="Select a field according to your experience"
                data={[
                  { value: "SIX_MONTHS", label: "0-6 months" },
                  { value: "ONE_YEAR", label: "6-12 months" },
                  { value: "TWO_YEARS", label: "1-2 years" },
                  { value: "FOUR_YEARS", label: "2-4 years" },
                  { value: "SEVEN_YEARS", label: "4-7 years" },
                  { value: "MORE_THAN_7_YEARS", label: ">7 years" },
                ]}
                defaultValue="React"
                allowDeselect={false}
                mt="sm"
              />
              {errors.experience && (
                <Text c="red">{errors.experience.message}</Text>
              )}
              <Button type="submit" mt={30} mb={5} loading={isSubmitting}>
                Submit
              </Button>
              {errors.root && <Text c="red">{errors.root.message}</Text>}
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default ModalAssignSkillToEmp;
