import { assignRoles } from "@/app/api-services/userService";
import { Roles } from "@/app/enums/enums";
import {
  ActionIcon,
  Button,
  Checkbox,
  Modal,
  rem,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import { UUID } from "crypto";
import React, { useEffect, useState } from "react";

type ModalAssignRoleUserProps = {
  id: UUID;
  initialRoles: Roles[];
  refresh: boolean;
  setRefresh: (value: boolean) => void;
};

const ModalAssignRoleUser = ({
  id,
  initialRoles,
  refresh,
  setRefresh,
}: ModalAssignRoleUserProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRoles, setSelectedRoles] = useState<Roles[]>(initialRoles);
  const checkboxList = [
    {
      value: Roles.Organization_Admin,
      label: "Organization Administrator",
    },
    { value: Roles.Department_Manager, label: "Department Manager" },
    { value: Roles.Project_Manager, label: "Project Manager" },
  ];

  const handleCheckboxChange = (value: Roles) => {
    setSelectedRoles((prev) =>
      prev.includes(value)
        ? prev.filter((role) => role !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    try {
      await assignRoles(id, selectedRoles);
      console.log("Updated successful:", selectedRoles);
      close();
      setRefresh(!refresh);
    } catch (error) {
      console.error("Failed to update roles:", error);
    }
  };

  useEffect(() => {
    if (opened) {
      setSelectedRoles(
        initialRoles.map((roleName) => {
          if (Object.values(Roles).includes(roleName as Roles)) {
            return Roles[roleName as unknown as keyof typeof Roles];
          } else {
            throw new Error(`Rolul '${roleName}' nu există în enum.`);
          }
        })
      );
      console.log("opened initialRoles:", initialRoles);
      console.log("opened selectedRoles:", selectedRoles);
      console.log(
        "a intrat, bool:",
        selectedRoles.includes(checkboxList[1].value)
      );
      console.log("a intrat, value:", checkboxList[1].value);
    }
  }, [opened, initialRoles]);

  return (
    <div>
      <Tooltip label="Assign a role" color="blue" withArrow closeDelay={30}>
        <ActionIcon variant="subtle" onClick={open}>
          <IconSquareRoundedPlus
            style={{ width: rem(26), height: rem(26) }}
            stroke={1.5}
          />
        </ActionIcon>
      </Tooltip>

      <Modal.Root opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Title order={3}>Assign roles to this user</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Text c="dimmed" size="sm">
              Select one or multiple roles to assign to this user.
            </Text>
            <Stack gap="lg" mt={30}>
              {checkboxList.map((item) => (
                <Checkbox
                  label={item.label}
                  key={item.value}
                  value={item.value}
                  checked={selectedRoles.includes(item.value)}
                  onChange={() => handleCheckboxChange(item.value)}
                />
              ))}
            </Stack>
            <Button mt={30} mb={15} onClick={handleSubmit}>
              Submit
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default ModalAssignRoleUser;
