import { Assignment } from "@/app/api-services/assignmentServices";
import {
  Deallocation,
  deleteDeallocationById,
  getDeallocationsByProjectId,
} from "@/app/api-services/deallocationServices";
import { getUserById, User } from "@/app/api-services/userService";
import { Button, Flex, Group, Paper, Title } from "@mantine/core";
import { useEffect, useState } from "react";

const DeallocationCard = ({ projectId }: { projectId: string }) => {
  const [assignments, setAssignments] = useState<Deallocation[]>([]);
  const [users, setUsers] = useState<User[] | null>([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const fetchAssignments = async () => {
      if (projectId) {
        try {
          const response = await getDeallocationsByProjectId(projectId);
          if (response) setAssignments(response);
          else setAssignments([]);
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          //setLoading(false);
        }
      }
    };

    fetchAssignments();
  }, [projectId, refresh]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userPromises = assignments.map(async (assignment) => {
          const response = await getUserById(assignment.userId);
          return response;
        });
        const usersData = await Promise.all(userPromises);
        const filteredUsersData = usersData.filter(
          (user): user is User => user !== null
        );
        setUsers(filteredUsersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (assignments.length > 0) {
      fetchUsers();
    }
  }, [assignments, refresh]);
  const handleDelete = async (id: string) => {
    const response = await deleteDeallocationById(id);
    if (response) setRefresh(!refresh);
  };
  return (
    <div>
      <Flex gap="md" wrap="wrap" maw="60vw" mt="xl">
        {assignments.length > 0 &&
          assignments.map((as) => {
            const user = users?.find((user) => user.id === as.userId);
            return (
              <Paper key={as.id} shadow="none" withBorder p="md">
                <Group gap={50}>
                  <Title order={3}>{user ? user.userName : as.userId}</Title>
                  <Button variant="default" disabled>
                    Update deallocation
                  </Button>
                  <Button color="red" onClick={() => handleDelete(as.id)}>
                    Revoke
                  </Button>
                </Group>
              </Paper>
            );
          })}
      </Flex>
    </div>
  );
};

export default DeallocationCard;
