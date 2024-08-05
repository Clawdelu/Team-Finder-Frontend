import { Project } from "@/app/api-services/projectServices";
import {
  getFullyAvailableUsers,
  getPartiallyAvailableUsers,
  getUnavailableUsers,
  getUsersFromCloseToFinishProj,
  User,
} from "@/app/api-services/userService";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Notification,
  NumberInput,
  Paper,
  rem,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import ResultsUserInfoCard from "./ResultsUserInfoCard";

const TeamFinderCards = ({ project }: { project: Project }) => {
  const [checkboxes, setCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
  });
  const [inputValue, setInputValue] = useState<number | undefined>();
  const [viewInput, setViewInput] = useState(false);
  const [employees, setEmployees] = useState<User[]>();
  const [enteredWeeks, setEnteredWeeks] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxes({
      ...checkboxes,
      [e.target.name]: e.target.checked,
    });
  };
  const handleInputChange = (value: number) => {
    setInputValue(value);
    if (value) setEnteredWeeks(true);
    else setEnteredWeeks(false);
  };
  const handleC = () => {
    // console.log("Rezultat: ", checkboxes);
    //console.log("Date:", inputValue);
    handleFindTeam();
  };

  useEffect(() => {
    if (checkboxes.checkbox2) setViewInput(true);
    else setViewInput(false);
  }, [checkboxes.checkbox2]);

  const handleFindTeam = async () => {
    if (checkboxes.checkbox2 && !enteredWeeks) {
      setShowNotification(true);
      return;
    }

    let employees: User[] = [];
    if (checkboxes.checkbox1) {
      const partially = await getPartiallyAvailableUsers(project.id);
      if (partially) employees.push(...partially);
      console.log();
    }

    if (checkboxes.checkbox3) {
      const unavailable = await getUnavailableUsers(project.id);
      if (unavailable) employees.push(...unavailable);
    }

    if (checkboxes.checkbox2 && inputValue) {
      const closeToFin = await getUsersFromCloseToFinishProj(
        project.id,
        inputValue.toString()
      );
      if (closeToFin) employees.push(...closeToFin);
    }
    //console.log("inainte de fully", employees);
    console.log("proj id", project.id);
    const fully = await getFullyAvailableUsers(project.id);
    if (fully) employees.push(...fully);

    setEmployees(employees);
    //console.log("EMP: ", employees);
  };
  return (
    <div>
      <Flex gap="md" wrap="nowrap" maw="90vw" align="center" mt="xl">
        <Paper p="md" withBorder shadow="none">
          <Checkbox
            label="Include partially available"
            name="checkbox1"
            checked={checkboxes.checkbox1}
            onChange={handleCheckboxChange}
          />
        </Paper>
        <Paper p="md" withBorder shadow="none">
          <Checkbox
            label="Include from projects close to finish"
            name="checkbox2"
            checked={checkboxes.checkbox2}
            onChange={handleCheckboxChange}
          />
          {viewInput && (
            <NumberInput
              label="Deadline weeks"
              placeholder="Beetween 2 and 6"
              min={2}
              max={6}
              mt="xs"
              value={inputValue}
              onChange={(value) => handleInputChange(Number(value))}
              error={showNotification}
            />
          )}
        </Paper>
        <Paper p="md" withBorder shadow="none">
          <Checkbox
            label="Include unavailable"
            name="checkbox3"
            checked={checkboxes.checkbox3}
            onChange={handleCheckboxChange}
          />
        </Paper>
        {/* <Paper p="md" withBorder shadow="none">
          <Checkbox
            label="Include past projects roles or skills"
            name="checkbox4"
            checked={checkboxes.checkbox4}
            onChange={handleCheckboxChange}
          />
        </Paper> */}

        <Button onClick={handleC}>Find team</Button>
      </Flex>
      {employees && <ResultsUserInfoCard users={employees} project={project} />}
      {showNotification && (
        <Box style={{ position: "fixed", bottom: rem(20), right: rem(10) }}>
          <Notification
            onClose={() => setShowNotification(false)}
            color="red"
            title="Deadline weeks cannot be empty"
          >
            Please fill in.
          </Notification>
        </Box>
      )}
    </div>
  );
};

export default TeamFinderCards;
