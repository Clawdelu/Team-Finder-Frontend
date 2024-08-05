"use client";
import MyDepartSkillCard from "@/app/components/cards/MyDepartSkillCard";
import MyDepartProjectsTable from "@/app/lib/tables/MyDepartProjectsTable";
import { Divider, Tabs, Title } from "@mantine/core";
import React from "react";

const MyDepartmentPage = () => {
  return (
    <div>
      <Title order={3}>My department</Title>
      <Divider my="md" />
      <Tabs variant="pills" defaultValue="projects" mt="md">
        <Tabs.List>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
          <Tabs.Tab value="skills">Skills</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="projects">
          <MyDepartProjectsTable />
        </Tabs.Panel>
        <Tabs.Panel value="skills">
          <MyDepartSkillCard />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default MyDepartmentPage;
