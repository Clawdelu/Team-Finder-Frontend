import { UUID } from "crypto";
import Link from "next/link";
import React from "react";
import { Text } from "@mantine/core";

const InvitationLink = ({ invitationId }: { invitationId: UUID }) => {
  return (
    // <Link href={`/${invitationId}/signup`} style={{ textDecoration: "none" }}>
    <Text c="dark" size="md">
      http://localhost:3000/{invitationId}/signup
    </Text>
    // </Link>
  );
};

export default InvitationLink;
