import { Button, Container, Text, Title, Center } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

const Unauthorized: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Center>
        <div style={{ textAlign: "center" }}>
          <Title order={1} style={{ marginBottom: "1rem" }}>
            Unauthorized
          </Title>
          <Text size="lg" style={{ marginBottom: "2rem" }}>
            You do not have the necessary permissions to access this page.
          </Text>
          <Button variant="outline" onClick={handleGoBack}>
            Go Back to Home
          </Button>
        </div>
      </Center>
    </Container>
  );
};

export default Unauthorized;
