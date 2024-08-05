import {
  getAllCategories,
  SkillCategory,
} from "@/app/api-services/categoryService";
import ModalCreateCategory from "@/app/components/modals/ModalCreateCategory";
import ModalDeleteCategory from "@/app/components/modals/ModalDeleteCategory";
import ModalEditCategory from "@/app/components/modals/ModalEditCategory";
import { Box, Group, LoadingOverlay, ScrollArea, Table } from "@mantine/core";
import { useEffect, useState } from "react";

const CategoryTable = () => {
  const [refresh, setRefresh] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SkillCategory[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const categories = await getAllCategories();
      setLoading(false);
      setData(categories || []);
    };
    fetchData();
  }, [refresh]);

  const rows = data?.map((element) => (
    <Table.Tr key={element.id} style={{ display: "flex" }}>
      <Table.Td style={{ flex: 1 }}>{element.skillCategoryName}</Table.Td>
      <Table.Td style={{ flexShrink: 0 }}>
        <Group>
          <ModalEditCategory
            id={element.id}
            refresh={refresh}
            setRefresh={setRefresh}
            skillCategoryName={element.skillCategoryName}
          />
          <ModalDeleteCategory
            id={element.id}
            refresh={refresh}
            setRefresh={setRefresh}
            setLoading={setLoading}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box mt="lg">
      <ScrollArea
        mah={500}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        type="auto"
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Table stickyHeader highlightOnHover withTableBorder maw="80%">
          <Table.Thead>
            <Table.Tr style={{ display: "flex" }}>
              <Table.Th style={{ flex: 1 }}>Name</Table.Th>
              <Table.Th style={{ flexShrink: 0 }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      <ModalCreateCategory refresh={refresh} setRefresh={setRefresh} />
    </Box>
  );
};

export default CategoryTable;
