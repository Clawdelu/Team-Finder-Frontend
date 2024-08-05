import { DepartmentsTable } from "@/app/lib/tables/DepartmentsTable";
import { Divider, Title } from "@mantine/core";
import React from "react";

const DepartmentPage = () => {
  return (
    <div>
      <Title order={3}>Departments</Title>
      <Divider my="md" />
      <DepartmentsTable />
    </div>
  );
};

export default DepartmentPage;
