import { addMembersToDepartment } from "@/app/api-services/departmentServices";
import { ActionIcon, Box, Notification, rem, Tooltip } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { UUID } from "crypto";
import { useState } from "react";

type AssignMemberBtnProps = {
  id: UUID;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  setShowNotification: (value: boolean) => void;
};

const AssignMemberBtn = ({
  id,
  refresh,
  setRefresh,
  setShowNotification,
}: AssignMemberBtnProps) => {
  const [loading, setLoading] = useState(false);

  const handleAssignMember = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    let members: string[] = [id];
    console.log("members:", members);
    await addMembersToDepartment(members);
    setLoading(false);
    setShowNotification(true);
    setRefresh(!refresh);
  };
  return (
    <div>
      <Tooltip
        label="Assign member to your department"
        color="blue"
        withArrow
        closeDelay={30}
      >
        <ActionIcon
          variant="subtle"
          color="blue"
          loading={loading}
          onClick={handleAssignMember}
        >
          <IconPlus style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

export default AssignMemberBtn;
