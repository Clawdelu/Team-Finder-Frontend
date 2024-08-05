import { createCategory } from "@/app/api-services/categoryService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, rem, TextInput, Title, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCategoryPlus } from "@tabler/icons-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  skillCategoryName: z.string().min(2),
});

type SkillCategory = z.infer<typeof schema>;

type ModalCreateCategoryProps = {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};

const ModalCreateCategory = ({
  refresh,
  setRefresh,
}: ModalCreateCategoryProps) => {
  const iconStyle = { width: rem(18), height: rem(18) };
  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillCategory>({ resolver: zodResolver(schema) });

  const OnSubmit: SubmitHandler<SkillCategory> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await createCategory(data);
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
        variant="outline"
        rightSection={<IconCategoryPlus style={iconStyle} stroke={1.5} />}
        mt="lg"
        onClick={open}
      >
        New category
      </Button>

      <Modal.Root opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Title order={3}>Create a skill category</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(OnSubmit)}>
              <TextInput
                {...register("skillCategoryName")}
                label="Skill category"
                description="Enter the name of the category. Click create when you're done."
                placeholder=" e.g.Programming Language, Libraries, Frameworks, Software Engineering"
              />
              {errors.skillCategoryName && (
                <Text c="red" size="sm">
                  {errors.skillCategoryName.message}
                </Text>
              )}
              <Button type="submit" mt={30} mb={5} loading={isSubmitting}>
                Create
              </Button>
              {errors.root && (
                <Text c="red" size="sm">
                  {errors.root.message}
                </Text>
              )}
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default ModalCreateCategory;
