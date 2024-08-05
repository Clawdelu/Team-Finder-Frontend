"use client";
import { UsersRolesSortTable } from "@/app/lib/tables/UsersRolesSortTable";

import { Divider, Title } from "@mantine/core";

const Employee = () => {
  return (
    <div>
      <Title order={3}>Employees</Title>
      <Divider my="md" />
      <UsersRolesSortTable />
    </div>
  );
};

export default Employee;
