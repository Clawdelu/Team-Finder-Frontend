import { Container, Title, Text, Button } from "@mantine/core";
import classes from "./HeroImage.module.css";
import Link from "next/link";

export function HeroImage() {
  return (
    <div className={classes.root}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Perfect Matches,{" "}
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: "pink", to: "yellow" }}
              >
                Every Time
              </Text>
            </Title>

            <Text className={classes.description} mt={30} c="white">
              Discover the perfect team members for every project with Squad
              Sync. Boost your team's performance with intelligent matching that
              aligns project requirements with team dynamics for productivity
              and success every time.
            </Text>

            <Button
              variant="gradient"
              gradient={{ from: "pink", to: "yellow" }}
              size="xl"
              className={classes.control}
              mt={40}
              component={Link}
              href="/register"
            >
              Get started
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
