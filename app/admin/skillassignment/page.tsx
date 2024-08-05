"use client";
import { AllSkillsTable } from "@/app/lib/tables/AllSkillsTable";
import MySkillsTableAssignment from "@/app/lib/tables/MySkillsTableAssignment";
import { Divider, rem, Tabs, Title } from "@mantine/core";
import { IconListDetails } from "@tabler/icons-react";
import { useState } from "react";

const SkillAssignmentPage = () => {
  const iconStyle = { width: rem(18), height: rem(18) };
  const [refresh, setRefresh] = useState(false);
  return (
    <div>
      <Title order={3}>Skills</Title>
      <Divider my="md" />
      <Tabs variant="pills" defaultValue="allskills">
        <Tabs.List>
          <Tabs.Tab
            value="allskills"
            leftSection={<IconListDetails style={iconStyle} />}
          >
            All skills
          </Tabs.Tab>
          <Tabs.Tab
            value="myskills"
            leftSection={<IconListDetails style={iconStyle} />}
          >
            My skills
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="allskills">
          <AllSkillsTable refresh={refresh} setRefresh={setRefresh} />
        </Tabs.Panel>

        <Tabs.Panel value="myskills">
          <MySkillsTableAssignment refresh={refresh} setRefresh={setRefresh} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default SkillAssignmentPage;
