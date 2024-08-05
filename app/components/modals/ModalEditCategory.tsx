// import { useDeleteState } from "@/app/lib/tables/SkillCategorysTable";

import { updateCategory } from "@/app/api-services/categoryService";
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
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  skillCategoryName: z.string().min(2),
});

type SkillCategory = z.infer<typeof schema>;

type ModalEditCategoryProps = {
  id: UUID;
  skillCategoryName: string;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};

const ModalEditCategory = ({
  id,
  skillCategoryName,
  refresh,
  setRefresh,
}: ModalEditCategoryProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SkillCategory>({ resolver: zodResolver(schema) });

  const OnSubmit: SubmitHandler<SkillCategory> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await updateCategory(id, data);
      console.log("Updated successful", response);
      close();
      setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to authenticate. Please check your credentials.",
      });
    }
  };

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
                {...register("skillCategoryName")}
                label="New name"
                placeholder={skillCategoryName}
                //placeholder="e.g. Frontend Developer, Scrum Master, UX Designer"
                description="Make changes to your category here. Click save when you're done."
                //value={roleInProject}
              />
              {errors.skillCategoryName && (
                <Text c="red">{errors.skillCategoryName.message}</Text>
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

export default ModalEditCategory;
