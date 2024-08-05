"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { SignUpEmployee } from "../../lib/register/SignUpEmployee";

const EmployeeRegisterPage = () => {
  // const params = useParams();
  // const { invitationId } = params;
  const params = useParams<{ invitationId: string }>();
  const invitationId = params.invitationId;

  //const invitationId = searchParams.get("invitationId");
  // const invitationId = useMemo(
  //   () => searchParams.get("invitationId"),
  //   [searchParams]
  // );

  useEffect(() => {
    if (invitationId) {
      console.log("Invitation ID:", invitationId);
    }
  }, [invitationId]);
  return (
    <div>
      <SignUpEmployee invitationId={invitationId} />
    </div>
  );
};

export default EmployeeRegisterPage;
