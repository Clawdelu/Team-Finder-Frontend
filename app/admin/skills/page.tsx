"use client";
import CategoryTable from "@/app/lib/tables/CategoryTable";
import SkillsTable from "@/app/lib/tables/SkillTable";
import { Divider, rem, Tabs, Title } from "@mantine/core";
import { IconCategory2, IconListDetails } from "@tabler/icons-react";

const SkillAssignmentPage = () => {
  const iconStyle = { width: rem(18), height: rem(18) };
  return (
    <div>
      <Title order={3}>Skills</Title>
      <Divider my="md" />
      <Tabs variant="pills" defaultValue="view">
        <Tabs.List>
          <Tabs.Tab
            value="view"
            leftSection={<IconListDetails style={iconStyle} />}
          >
            View
          </Tabs.Tab>
          <Tabs.Tab
            value="categories"
            leftSection={<IconCategory2 style={iconStyle} />}
          >
            Categories
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="view">
          <SkillsTable />
        </Tabs.Panel>

        <Tabs.Panel value="categories">
          <CategoryTable />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default SkillAssignmentPage;
