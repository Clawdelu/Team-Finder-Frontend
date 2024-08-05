"use client";
import {
  getProjectsByUserId,
  Project,
  ViewEmployeeProjectDto,
} from "@/app/api-services/projectServices";
import { getConnectedUser } from "@/app/api-services/userService";
import ProjectCard from "@/app/components/cards/ProjectCard";
import { Divider, Loader, Tabs, Title } from "@mantine/core";
import { randomUUID } from "crypto";
import React, { useEffect, useState } from "react";

const MyProjectsPage = () => {
  const [currentProjects, setCurrentProjects] = useState<Project[] | null>(
    null
  );
  const [pastProjects, setPastProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const user = await getConnectedUser();
      const response = await getProjectsByUserId(
        user ? user?.id.toString() : randomUUID()
      );
      if (response) {
        let projects: ViewEmployeeProjectDto = response;
        setCurrentProjects(projects.currentProjects);
        setPastProjects(projects.pastProjects);
      }
      console.log("loading:", loading);
      console.log("current projects: ", currentProjects);
      setLoading(false);
      // setTimeout(() => setShowNotification(false), 8000);
    };

    fetchData();
  }, []);
  return (
    <div>
      <Title order={3}>My Projects</Title>
      <Divider my="md" />
      <Tabs variant="pills" defaultValue="current">
        <Tabs.List>
          <Tabs.Tab
            value="current"
            //leftSection={<IconListDetails style={iconStyle} />}
          >
            Current projects
          </Tabs.Tab>
          <Tabs.Tab
            value="past"
            //leftSection={<IconCategory2 style={iconStyle} />}
          >
            Past projects
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="current">
          {loading && <Loader color="blue" mt="md" />}

          {!loading && currentProjects && currentProjects.length === 0 && (
            <Title order={4} mt="md">
              No projects
            </Title>
          )}
          {!loading &&
            currentProjects &&
            currentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </Tabs.Panel>

        <Tabs.Panel value="past">
          {loading && <Loader color="blue" mt="md" />}

          {!loading && pastProjects && pastProjects.length === 0 && (
            <Title order={4} mt="md">
              No projects
            </Title>
          )}
          {!loading &&
            pastProjects &&
            pastProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default MyProjectsPage;
