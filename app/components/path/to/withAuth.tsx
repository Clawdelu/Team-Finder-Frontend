"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasSomeRoles, isTokenValid } from "@/app/api-services/authService";

const withAuthorization = (
  WrappedComponent: React.ComponentType<any>,
  requiredRoles: string[]
) => {
  return (props: any) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!isTokenValid(token)) {
        console.log("A expirat token..hai la login");
        router.push("/login");
        return;
      }

      if (!hasSomeRoles(token, requiredRoles)) {
        router.push("/unauthorized");
        console.log("Nu ai rolul necesar");
        return;
      }

      setIsAuthorized(true);
    }, [router]);

    if (!isAuthorized) {
      console.log("Nu e autorizat si se returneaza null");
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};
export default withAuthorization;
