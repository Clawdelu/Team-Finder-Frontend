"use client";
import { Tabs } from "@/app/lib/flaoting-indicator/FloatingIndicator";
import { Divider, Title } from "@mantine/core";

const AssignMembersPage = () => {
  return (
    <div>
      <Title order={3}>Members</Title>
      <Divider my="md" />
      <Tabs />
      {/*  <AssignMembersTable /> */}
    </div>
  );
};

export default AssignMembersPage;
