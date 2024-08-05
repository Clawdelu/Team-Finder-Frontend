// import { useDeleteState } from "@/app/lib/tables/SkillCategorysTable";

import { getAllCategories } from "@/app/api-services/categoryService";
import { Skill, updateSkill } from "@/app/api-services/skillServices";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Button,
  Checkbox,
  Modal,
  rem,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  skillName: z.string().min(2),
  description: z.string().min(2),
  addedToDepartment: z.boolean(),
  skillCategoryId: z.string().uuid("Choose a value"),
});

type SkillToUpdate = z.infer<typeof schema>;

type ModalEditSkillProps = {
  id: UUID;
  skillUpdate: Skill;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};

const ModalEditSkill = ({
  id,
  skillUpdate,
  refresh,
  setRefresh,
}: ModalEditSkillProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SkillToUpdate>({ resolver: zodResolver(schema) });
  const [dataCategory, setDataCategory] =
    useState<{ value: string; label: string }[]>();

  useEffect(() => {
    const fetchCategoryData = async () => {
      const categories = await getAllCategories();
      setDataCategory(
        categories?.map((category) => ({
          value: category.id,
          label: category.skillCategoryName,
        }))
      );
    };
    fetchCategoryData();
  }, [refresh]);

  useEffect(() => {
    if (skillUpdate) {
      setValue("skillCategoryId", skillUpdate.skillCategory.id);
      setValue("skillName", skillUpdate.skillName);
      setValue("description", skillUpdate.description);
      setValue("addedToDepartment", false);
    }
  }, [skillUpdate, setValue]);

  const OnSubmit: SubmitHandler<SkillToUpdate> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await updateSkill(id, data);
      console.log("Updated successful", response);
      // console.log("Datele: ", data);
      close();
      setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to update. Please try again.",
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
              <Title order={3}>Update Skill</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(OnSubmit)}>
              <Select
                onChange={(value) => setValue("skillCategoryId", value || "")}
                label="Select category"
                placeholder="Pick value"
                data={dataCategory}
                searchable
                nothingFoundMessage="Nothing found..."
                clearable
                mt="md"
                allowDeselect={true}
                value={skillUpdate.skillCategory.id}
              />
              {errors.skillCategoryId && (
                <Text c="red">{errors.skillCategoryId.message}</Text>
              )}

              <TextInput
                {...register("skillName")}
                label="Skill name"
                //placeholder={skillUpdate.skillName}
                //placeholder="e.g. Frontend Developer, Scrum Master, UX Designer"
                description="Make changes to your skill here. Click save changes when you're done."
                mt="sm"
              />
              {errors.skillName && (
                <Text c="red">{errors.skillName.message}</Text>
              )}

              <Textarea
                {...register("description")}
                placeholder={skillUpdate.description}
                label="Description"
                autosize
                minRows={2}
                mt="sm"
              />
              {errors.description && (
                <Text c="red">{errors.description.message}</Text>
              )}
              <Checkbox
                {...register("addedToDepartment")}
                label="Add skill to your department"
                mt="sm"
                disabled
              />
              {errors.addedToDepartment && (
                <Text c="red">{errors.addedToDepartment.message}</Text>
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

export default ModalEditSkill;
