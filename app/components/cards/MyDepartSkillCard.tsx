import { getSkillsBySameDepart, Skill } from "@/app/api-services/skillServices";
import {
  Flex,
  Group,
  Paper,
  rem,
  ScrollArea,
  Text,
  Textarea,
} from "@mantine/core";
import { IconAdjustmentsBolt } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

const MyDepartSkillCard = () => {
  const [data, setData] = useState<Skill[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      //setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await getSkillsBySameDepart();
      // setLoading(false);
      if (response) setData(response);
    };
    fetchData();
  }, []);

  return (
    <div>
      <ScrollArea.Autosize mah="80vh" maw="100%" mx="auto" type="auto">
        <Flex gap="md" wrap="wrap" maw="100vw" mt="md">
          {data.length > 0 &&
            data.map((obj) => (
              <Paper mt="lg" p="lg" withBorder shadow="xs" w={600} miw={400}>
                <Group justify="space-between">
                  <Group>
                    <Text>Name:</Text>
                    <Text fw={600}>{obj.skillName}</Text>
                  </Group>
                  <IconAdjustmentsBolt
                    style={{ width: rem(60), height: rem(60) }}
                    stroke={1.5}
                  />
                </Group>
                <Group>
                  <Text>Category:</Text>
                  <Text fw={600}>{obj.skillCategory.skillCategoryName}</Text>
                </Group>
                <Textarea
                  placeholder="Description"
                  label="Description"
                  autosize
                  minRows={2}
                  mt="md"
                  value={obj.description}
                />
              </Paper>
            ))}
          {/* <Paper mt="lg" p="lg" withBorder shadow="xs" w={600} miw={400}>
            <Group justify="space-between">
              <Group>
                <Text>Name:</Text>
                <Text fw={600}>namr</Text>
              </Group>
              <IconAdjustmentsBolt
                style={{ width: rem(60), height: rem(60) }}
                stroke={1.5}
              />
            </Group>
            <Group>
              <Text>Category:</Text>
              <Text fw={600}>caeg</Text>
            </Group>
            <Textarea
              placeholder="Description"
              label="Description"
              autosize
              minRows={2}
              mt="md"
              value="{obj.description}"
            />
          </Paper>
          <Paper mt="lg" p="lg" withBorder shadow="xs" w={600} miw={400}>
            <Group justify="space-between">
              <Group>
                <Text>Name:</Text>
                <Text fw={600}>namr</Text>
              </Group>
              <IconAdjustmentsBolt
                style={{ width: rem(60), height: rem(60) }}
                stroke={1.5}
              />
            </Group>
            <Group>
              <Text>Category:</Text>
              <Text fw={600}>caeg</Text>
            </Group>
            <Textarea
              placeholder="Description"
              label="Description"
              autosize
              minRows={2}
              mt="md"
              value="{obj.description}"
            />
          </Paper> */}
        </Flex>
      </ScrollArea.Autosize>
    </div>
  );
};

export default MyDepartSkillCard;
