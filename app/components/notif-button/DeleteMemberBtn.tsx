import { removeMembersFromDepartment } from "@/app/api-services/departmentServices";
import { ActionIcon, rem, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { UUID } from "crypto";
import { useState } from "react";
type DeleteMemberBtnProps = {
  id: UUID;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  setShowNotification: (value: boolean) => void;
};
const DeleteMemberBtn = ({
  id,
  refresh,
  setRefresh,
  setShowNotification,
}: DeleteMemberBtnProps) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteMember = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    let members: string[] = [id];
    const response = await removeMembersFromDepartment(members);
    setLoading(false);
    setRefresh(!refresh);
    setShowNotification(true);
  };
  return (
    <div>
      <Tooltip
        label="Delete member from your department"
        color="red"
        withArrow
        closeDelay={30}
      >
        <ActionIcon
          variant="subtle"
          color="red"
          loading={loading}
          onClick={handleDeleteMember}
        >
          <IconTrash style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

export default DeleteMemberBtn;
