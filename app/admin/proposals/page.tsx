"use client";
import {
  Assignment,
  getAssignments,
  getAssignmentsDepartManager,
  updateAssignStatus,
} from "@/app/api-services/assignmentServices";
import {
  Deallocation,
  getDeallocaionsDepartManager,
  getDeallocations,
  updateDeallStatus,
} from "@/app/api-services/deallocationServices";
import { getProjectById, Project } from "@/app/api-services/projectServices";
import { getUserById, User } from "@/app/api-services/userService";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Notification,
  Paper,
  rem,
  ScrollArea,
  Tabs,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";

//  type Assignment = {
//     id: string;
//     workHours: number;
//     teamRoles: TeamRole[];
//     comments: string;
//     userId: string;
//     projectId: string;
//     status: string;
//   };
//    interface TeamRole {
//     id: string;
//     roleInProject: string;
//     createdBy: string;
//   }
type AssignmentWithDetails = Assignment & {
  user: User | null;
  project: Project | null;
};
type DeallocationtWithDetails = Deallocation & {
  user: User | null;
  project: Project | null;
};
const ProposalPage = () => {
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([]);
  const [deallocations, setDeallocations] = useState<
    DeallocationtWithDetails[]
  >([]);
  const [refresh, setRefresh] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showNotification1, setShowNotification1] = useState(false);
  const [showNotification2, setShowNotification2] = useState(false);
  const [showNotification3, setShowNotification3] = useState(false);
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getAssignmentsDepartManager();
        if (response) {
          const assignmentsWithDetails = await Promise.all(
            response.map(async (assignment) => {
              const user = await getUserById(assignment.userId);
              const project = await getProjectById(assignment.projectId);
              return {
                ...assignment,
                user,
                project,
              };
            })
          );
          setAssignments(assignmentsWithDetails);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    const fetchDeallocations = async () => {
      try {
        const response = await getDeallocaionsDepartManager();
        if (response) {
          const dealWithDetails = await Promise.all(
            response.map(async (deal) => {
              const user = await getUserById(deal.userId);
              const project = await getProjectById(deal.projectId);
              return {
                ...deal,
                user,
                project,
              };
            })
          );
          setDeallocations(dealWithDetails);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchDeallocations();
    fetchAssignments();
  }, [refresh]);

  const handleAccept = async (assId: string) => {
    const response = await updateAssignStatus("ACCEPTED", assId);
    console.log(response);
    if (response) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } else setShowNotification(false);
    setRefresh(!refresh);
    //setShowNotification(true);
    console.log("ACCEPTED");
  };
  const handleReject = async (assId: string) => {
    const response = await updateAssignStatus("REJECTED", assId);
    console.log(response);
    if (response) {
      setShowNotification1(true);
      setTimeout(() => setShowNotification1(false), 3000);
    } else setShowNotification1(false);
    setRefresh(!refresh);
    //setShowNotification1(true);
    console.log("REJECTED");
  };
  const handleAcceptDeal = async (assId: string) => {
    const response = await updateDeallStatus("ACCEPTED", assId);
    console.log(response);
    if (response) {
      setShowNotification2(true);
      setTimeout(() => setShowNotification2(false), 3000);
    } else setShowNotification2(false);
    setRefresh(!refresh);
    //setShowNotification2(true);
    console.log("ACCEPTED");
  };
  const handleRejectDeal = async (assId: string) => {
    const response = await updateDeallStatus("REJECTED", assId);
    console.log(response);
    if (response) {
      setShowNotification3(true);
      setTimeout(() => setShowNotification3(false), 3000);
    } else setShowNotification3(false);
    setRefresh(!refresh);
    //setShowNotification3(true);
    console.log("REJECTED");
  };
  return (
    <div>
      <Title order={3}>Proposals</Title>
      <Divider my="md" />
      <Tabs variant="pills" defaultValue="assignments" mt="md">
        <Tabs.List>
          <Tabs.Tab value="assignments">Assignments</Tabs.Tab>
          <Tabs.Tab value="deallocations">Deallocations</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="assignments">
          <ScrollArea.Autosize
            mah="80vh"
            maw="100%"
            mx="auto"
            type="auto"
            bg="rgba(240,240,240,0.2)"
          >
            <Flex gap="md" wrap="wrap" maw="100vw" mt="md">
              {assignments.length > 0 &&
                assignments.map((ass) => (
                  <Paper
                    mt="lg"
                    p="lg"
                    withBorder
                    shadow="xs"
                    w={600}
                    miw={400}
                  >
                    <Group justify="space-between">
                      <Group>
                        <Title order={4}>
                          {ass.project
                            ? ass.project.projectName
                            : "Project Name"}
                        </Title>
                        <Badge variant="default" radius="sm">
                          {ass.workHours} hours
                        </Badge>
                      </Group>
                      <Text size="md" fw={700}>
                        Assignment
                      </Text>
                    </Group>
                    <Divider my="md" />
                    <Text fw={700} size="md">
                      Project details
                    </Text>
                    <Group>
                      <Text size="sm">
                        {ass.project ? ass.project.projectStatus : "Status"}
                      </Text>
                      <Divider size="sm" orientation="vertical" />
                      <Text size="sm">
                        {ass.project
                          ? new Date(ass.project.startDate).toLocaleDateString()
                          : "Start Date"}
                      </Text>
                      <Divider size="sm" orientation="vertical" />
                      <Text size="sm">
                        {ass.project
                          ? new Date(
                              ass.project.deadlineDate
                            ).toLocaleDateString()
                          : "End Date"}
                      </Text>
                    </Group>
                    <Text fw={700} size="md" mt="md">
                      Employee details
                    </Text>
                    <Group>
                      <Text size="sm" fw={700}>
                        {ass.user ? ass.user.userName : "User Name"}
                      </Text>
                      <Divider size="sm" orientation="vertical" />
                      <Text size="sm" c="dimmed">
                        {ass.user ? ass.user.email : "User Email"}
                      </Text>
                      <Divider size="sm" orientation="vertical" />
                      <Group>
                        <Text size="sm" c="dimmed">
                          Work hours:
                        </Text>
                        <Text fw={700} size="sm">
                          {ass.workHours}
                        </Text>
                      </Group>
                    </Group>
                    <Text fw={700} size="md" mt="md">
                      Team roles
                    </Text>
                    <Group>
                      {ass.teamRoles.map((teamRole) => (
                        <Badge variant="filled" color="black" radius="sm">
                          {teamRole.roleInProject}
                        </Badge>
                      ))}
                    </Group>
                    <Textarea
                      placeholder="Type a reason why you no longer want this employee..."
                      label="Comments"
                      autosize
                      minRows={3}
                      mt="md"
                      value={ass.comments}
                    />
                    <Group mt="lg">
                      <Button
                        variant="filled"
                        color="black"
                        onClick={() => handleAccept(ass.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleReject(ass.id)}
                      >
                        Reject
                      </Button>
                    </Group>
                  </Paper>
                ))}
              {assignments.length === 0 && <Text>No assignments</Text>}
              {/* just for test */}
              {/* <Paper mt="lg" p="lg" withBorder shadow="xs" w={600} miw={400}>
                <Group justify="space-between">
                  <Group>
                    <Title order={4}>Nume Proiect</Title>
                    <Badge variant="default" radius="sm">
                      2 hours
                    </Badge>
                  </Group>
                  <Text size="md" fw={700}>
                    Assignment
                  </Text>
                </Group>
                <Divider my="md" />
                <Text fw={700} size="md">
                  Project details
                </Text>
                <Group>
                  <Text size="sm">Not Started</Text>
                  <Divider size="sm" orientation="vertical" />
                  <Text size="sm">6/28/2024</Text>
                  <Divider size="sm" orientation="vertical" />
                  <Text size="sm">1/1/1970</Text>
                </Group>
                <Text fw={700} size="md" mt="md">
                  Employee details
                </Text>
                <Group>
                  <Text size="sm" fw={700}>
                    User3
                  </Text>
                  <Divider size="sm" orientation="vertical" />
                  <Text size="sm" c="dimmed">
                    user3@yahoo.com
                  </Text>
                  <Divider size="sm" orientation="vertical" />
                  <Group>
                    <Text size="sm" c="dimmed">
                      Work hours:
                    </Text>
                    <Text fw={700} size="sm">
                      2
                    </Text>
                  </Group>
                </Group>
                <Text fw={700} size="md" mt="md">
                  Team roles
                </Text>
                <Badge variant="filled" color="black" radius="sm">
                  role1
                </Badge>
                <Textarea
                  placeholder="Type a reason why you no longer want this employee..."
                  label="Comments"
                  autosize
                  minRows={3}
                  mt="md"
                />
                <Group mt="lg">
                  <Button variant="filled" color="black">
                    Accept
                  </Button>
                  <Button variant="default">Reject</Button>
                </Group>
              </Paper>

              <Paper mt="lg" p="lg" withBorder shadow="xs" w={600} miw={400}>
                <Group justify="space-between">
                  <Group>
                    <Title order={4}>Nume Proiect</Title>
                    <Badge variant="default" radius="sm">
                      2 hours
                    </Badge>
                  </Group>
                  <Text size="md" fw={700}>
                    Assignment
                  </Text>
                </Group>
                <Divider my="md" />
                <Text fw={700} size="md">
                  Project details
                </Text>
                <Group>
                  <Text size="sm">Not Started</Text>
                  <Divider size="sm" orientation="vertical" />
                  <Text size="sm">6/28/2024</Text>
                  <Divider size="sm" orientation="vertical" />
                  <Text size="sm">1/1/1970</Text>
                </Group>
                <Text fw={700} size="md" mt="md">
                  Employee details
                </Text>
                <Group>
                  <Text size="sm" fw={700}>
                    User3
                  </Text>
                  <Divider size="sm" orientation="vertical" />
                  <Text size="sm" c="dimmed">
                    user3@yahoo.com
                  </Text>
                  <Divider size="sm" orientation="vertical" />
                  <Group>
                    <Text size="sm" c="dimmed">
                      Work hours:
                    </Text>
                    <Text fw={700} size="sm">
                      2
                    </Text>
                  </Group>
                </Group>
                <Text fw={700} size="md" mt="md">
                  Team roles
                </Text>
                <Badge variant="filled" color="black" radius="sm">
                  role1
                </Badge>
                <Textarea
                  placeholder="Type a reason why you no longer want this employee..."
                  label="Comments"
                  autosize
                  minRows={3}
                  mt="md"
                />
                <Group mt="lg">
                  <Button variant="filled" color="black">
                    Accept
                  </Button>
                  <Button variant="default">Reject</Button>
                </Group>
              </Paper> */}
            </Flex>
          </ScrollArea.Autosize>
        </Tabs.Panel>
        <Tabs.Panel value="deallocations">
          <ScrollArea.Autosize
            mah="80vh"
            maw="100%"
            mx="auto"
            type="auto"
            bg="rgba(240,240,240,0.2)"
          >
            <Flex gap="md" wrap="wrap" maw="100vw" mt="md">
              {deallocations.length > 0 &&
                deallocations.map((ass) => (
                  <Paper
                    mt="lg"
                    p="lg"
                    withBorder
                    shadow="xs"
                    w={600}
                    miw={400}
                  >
                    <Group justify="space-between">
                      <Group>
                        <Title order={4}>
                          {ass.project
                            ? ass.project.projectName
                            : "Project Name"}
                        </Title>
                      </Group>
                      <Text size="md" fw={700}>
                        Deallocation
                      </Text>
                    </Group>
                    <Divider my="md" />
                    <Text fw={700} size="md">
                      Project details
                    </Text>
                    <Group>
                      <Text size="sm">
                        {ass.project ? ass.project.projectStatus : "Status"}
                      </Text>
                      <Divider size="sm" orientation="vertical" />
                      <Text size="sm">
                        {ass.project
                          ? new Date(ass.project.startDate).toLocaleDateString()
                          : "Start Date"}
                      </Text>
                      <Divider size="sm" orientation="vertical" />
                      <Text size="sm">
                        {ass.project
                          ? new Date(
                              ass.project.deadlineDate
                            ).toLocaleDateString()
                          : "End Date"}
                      </Text>
                    </Group>
                    <Text fw={700} size="md" mt="md">
                      Employee details
                    </Text>
                    <Group>
                      <Text size="sm" fw={700}>
                        {ass.user ? ass.user.userName : "User Name"}
                      </Text>
                      <Divider size="sm" orientation="vertical" />
                      <Text size="sm" c="dimmed">
                        {ass.user ? ass.user.email : "User Email"}
                      </Text>
                    </Group>

                    <Textarea
                      placeholder="Type a reason why you no longer want this employee..."
                      label="Reason"
                      autosize
                      minRows={3}
                      mt="md"
                      value={ass.deallocationReason}
                    />
                    <Group mt="lg">
                      <Button
                        variant="filled"
                        color="black"
                        onClick={() => handleAcceptDeal(ass.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleRejectDeal(ass.id)}
                      >
                        Reject
                      </Button>
                    </Group>
                  </Paper>
                ))}
              {deallocations.length === 0 && <Text>No deallocations</Text>}
            </Flex>
          </ScrollArea.Autosize>
        </Tabs.Panel>
      </Tabs>

      {showNotification && (
        <Box style={{ position: "fixed", bottom: rem(20), right: rem(10) }}>
          <Notification
            onClose={() => setShowNotification(false)}
            color="blue"
            title="Accepted"
          ></Notification>
        </Box>
      )}
      {showNotification1 && (
        <Box style={{ position: "fixed", bottom: rem(20), right: rem(10) }}>
          <Notification
            onClose={() => setShowNotification1(false)}
            color="red"
            title="Rejected"
          ></Notification>
        </Box>
      )}
      {showNotification2 && (
        <Box style={{ position: "fixed", bottom: rem(20), right: rem(10) }}>
          <Notification
            onClose={() => setShowNotification2(false)}
            color="blue"
            title="Accepted"
          ></Notification>
        </Box>
      )}
      {showNotification3 && (
        <Box style={{ position: "fixed", bottom: rem(20), right: rem(10) }}>
          <Notification
            onClose={() => setShowNotification3(false)}
            color="red"
            title="Rejected"
          ></Notification>
        </Box>
      )}
    </div>
  );
};

export default ProposalPage;
