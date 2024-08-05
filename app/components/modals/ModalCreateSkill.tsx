import { getAllCategories } from "@/app/api-services/categoryService";
import { createSkill } from "@/app/api-services/skillServices";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Modal,
  rem,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  skillName: z.string().min(2),
  description: z.string().min(2),
  addedToDepartment: z.boolean(),
  skillCategoryId: z.string().uuid("Choose a value"),
});

type SkillCreate = z.infer<typeof schema>;

type ModalCreateSkillProps = {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};

const ModalCreateSkill = ({ refresh, setRefresh }: ModalCreateSkillProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillCreate>({ resolver: zodResolver(schema) });

  const [dataCategory, setDataCategory] =
    useState<{ value: string; label: string }[]>();

  const OnSubmit: SubmitHandler<SkillCreate> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await createSkill(data);
      console.log("Created successful", response);
      close();
      reset();
      setRefresh(!refresh);
    } catch (error) {
      setError("root", {
        message: "Failed to create a skill. Please try again.",
      });
    }
  };

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
        New Skill
      </Button>

      <Modal.Root opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Title order={3}>Create a skill</Title>
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
                allowDeselect={true}
              />
              {errors.skillCategoryId && (
                <Text c="red">{errors.skillCategoryId.message}</Text>
              )}

              <TextInput
                {...register("skillName")}
                label="Skill name"
                placeholder="e.g. Frontend Developer, Scrum Master, UX Designer"
                description="Make changes to your skill here. Click create when you're done."
                mt="sm"
              />
              {errors.skillName && (
                <Text c="red">{errors.skillName.message}</Text>
              )}

              <Textarea
                {...register("description")}
                placeholder="Type your description here."
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
              />
              {errors.addedToDepartment && (
                <Text c="red">{errors.addedToDepartment.message}</Text>
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

export default ModalCreateSkill;
