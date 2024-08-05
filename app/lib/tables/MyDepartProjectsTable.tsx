import {
  getProjectsForDepartment,
  ProjectWithMembers,
} from "@/app/api-services/projectServices";
import { Roles } from "@/app/enums/enums";
import {
  Badge,
  Box,
  Button,
  Group,
  LoadingOverlay,
  ScrollArea,
  Table,
  Title,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mockData: ProjectWithMembers[] = [
  {
    project: {
      id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
      projectName: "Project Alpha",
      projectPeriod: "2024-01-01 to 2024-06-01",
      startDate: "2024-01-01",
      deadlineDate: "2024-06-01",
      projectStatus: "Active",
      generalDescription: "A project to develop an innovative AI solution.",
      technologyStack: [
        { id: "6320d500-f3f4-4b09-9450-c56b45fb5c57", technologyName: "Java" },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Spring Boot",
        },
        { id: "6320d500-f3f4-4b09-9450-c56b45fb5c57", technologyName: "React" },
      ],
      teamRoles: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Developer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 3,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Tester",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 2,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
      ],
      createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
    },
    members: [
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Alice",
        email: "alice@example.com",
        roles: [Roles.Project_Manager, Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Bob",
        email: "bob@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Charlie",
        email: "charlie@example.com",
        roles: [Roles.Employee],
      },
    ],
  },
  {
    project: {
      id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
      projectName: "Project Beta",
      projectPeriod: "2024-02-01 to 2024-08-01",
      startDate: "2024-02-01",
      deadlineDate: "2024-08-01",
      projectStatus: "Planned",
      generalDescription: "A project to develop a mobile application.",
      technologyStack: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Flutter",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Firebase",
        },
      ],
      teamRoles: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Developer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 4,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Designer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 1,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
      ],
      createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
    },
    members: [
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Dave",
        email: "dave@example.com",
        roles: [Roles.Project_Manager, Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Eve",
        email: "eve@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Frank",
        email: "frank@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Grace",
        email: "grace@example.com",
        roles: [Roles.Employee],
      },
    ],
  },

  {
    project: {
      id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
      projectName: "Project Beta",
      projectPeriod: "2024-02-01 to 2024-08-01",
      startDate: "2024-02-01",
      deadlineDate: "2024-08-01",
      projectStatus: "Planned",
      generalDescription: "A project to develop a mobile application.",
      technologyStack: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Flutter",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Firebase",
        },
      ],
      teamRoles: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Developer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 4,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Designer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 1,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
      ],
      createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
    },
    members: [
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Dave",
        email: "dave@example.com",
        roles: [Roles.Project_Manager, Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Eve",
        email: "eve@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Frank",
        email: "frank@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Grace",
        email: "grace@example.com",
        roles: [Roles.Employee],
      },
    ],
  },
  {
    project: {
      id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
      projectName: "Project Beta",
      projectPeriod: "2024-02-01 to 2024-08-01",
      startDate: "2024-02-01",
      deadlineDate: "2024-08-01",
      projectStatus: "Planned",
      generalDescription: "A project to develop a mobile application.",
      technologyStack: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Flutter",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Firebase",
        },
      ],
      teamRoles: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Developer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 4,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Designer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 1,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
      ],
      createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
    },
    members: [
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Dave",
        email: "dave@example.com",
        roles: [Roles.Project_Manager, Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Eve",
        email: "eve@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Frank",
        email: "frank@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Grace",
        email: "grace@example.com",
        roles: [Roles.Employee],
      },
    ],
  },
  {
    project: {
      id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
      projectName: "Project Beta",
      projectPeriod: "2024-02-01 to 2024-08-01",
      startDate: "2024-02-01",
      deadlineDate: "2024-08-01",
      projectStatus: "Planned",
      generalDescription: "A project to develop a mobile application.",
      technologyStack: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Flutter",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Firebase",
        },
      ],
      teamRoles: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Developer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 4,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Designer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 1,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
      ],
      createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
    },
    members: [
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Dave",
        email: "dave@example.com",
        roles: [Roles.Project_Manager, Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Eve",
        email: "eve@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Frank",
        email: "frank@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Grace",
        email: "grace@example.com",
        roles: [Roles.Employee],
      },
    ],
  },
  {
    project: {
      id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
      projectName: "Project Beta",
      projectPeriod: "2024-02-01 to 2024-08-01",
      startDate: "2024-02-01",
      deadlineDate: "2024-08-01",
      projectStatus: "Planned",
      generalDescription: "A project to develop a mobile application.",
      technologyStack: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Flutter",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Firebase",
        },
      ],
      teamRoles: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Developer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 4,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Designer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 1,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
      ],
      createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
    },
    members: [
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Dave",
        email: "dave@example.com",
        roles: [Roles.Project_Manager, Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Eve",
        email: "eve@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Frank",
        email: "frank@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Grace",
        email: "grace@example.com",
        roles: [Roles.Employee],
      },
    ],
  },

  {
    project: {
      id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
      projectName: "Project Beta",
      projectPeriod: "2024-02-01 to 2024-08-01",
      startDate: "2024-02-01",
      deadlineDate: "2024-08-01",
      projectStatus: "Planned",
      generalDescription: "A project to develop a mobile application.",
      technologyStack: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Flutter",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          technologyName: "Firebase",
        },
      ],
      teamRoles: [
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Developer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 4,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
        {
          id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          teamRole: {
            id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
            roleInProject: "Designer",
            createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
          },
          noOfMembers: 1,
          projectId: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        },
      ],
      createdBy: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
    },
    members: [
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Dave",
        email: "dave@example.com",
        roles: [Roles.Project_Manager, Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Eve",
        email: "eve@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Frank",
        email: "frank@example.com",
        roles: [Roles.Employee],
      },
      {
        id: "6320d500-f3f4-4b09-9450-c56b45fb5c57",
        userName: "Grace",
        email: "grace@example.com",
        roles: [Roles.Employee],
      },
    ],
  },
];

const MyDepartProjectsTable = () => {
  const [refresh, setRefresh] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProjectWithMembers[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await getProjectsForDepartment();
      setLoading(false);
      if (response) setData(response);
    };
    fetchData();
  }, [refresh]);

  const handleSeeProj = (projId: string) => {
    router.push(`/admin/projects/${projId}`);
  };

  const rows = data?.map((element) => (
    <Table.Tr key={element.project.id}>
      <Table.Td>{element.project.projectName}</Table.Td>
      <Table.Td>{element.project.deadlineDate}</Table.Td>
      <Table.Td>{element.project.projectStatus}</Table.Td>
      <Table.Td>
        <Group>
          {element.members.length > 0 &&
            element.members.map((mem) => (
              <Badge variant="default">{mem.userName}</Badge>
            ))}
        </Group>
      </Table.Td>

      <Table.Td style={{ flexShrink: 0 }}>
        <Button
          variant="default"
          rightSection={<IconChevronRight />}
          onClick={() => {
            handleSeeProj(element.project.id);
          }}
        >
          See project
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box mt="lg">
      <Title order={4} mb="md">
        Projects
      </Title>
      <ScrollArea
        mah={600}
        h={600}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        type="auto"
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Table stickyHeader highlightOnHover withTableBorder maw="90%">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Project name</Table.Th>
              <Table.Th>Deadline date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Members</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
};

export default MyDepartProjectsTable;
