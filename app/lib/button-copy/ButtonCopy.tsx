"use client";
import { ActionIcon, Button, CopyButton, rem, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconCopy, IconCheck } from "@tabler/icons-react";

export function ButtonCopy({ link }: { link: string }) {
  const clipboard = useClipboard();
  return (
    <Tooltip
      label="Link copied!"
      offset={5}
      position="bottom"
      radius="xl"
      transitionProps={{ duration: 100, transition: "slide-down" }}
      opened={clipboard.copied}
    >
      {/* <Button
        variant="transparent"
        rightSection={
          clipboard.copied ? (
            <IconCheck
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          ) : (
            <IconCopy
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          )
        }
        styles={{
          root: { paddingRight: rem(14) },
          section: { marginLeft: rem(0) },
        }}
        onClick={() => clipboard.copy({ link })}
      ></Button> */}
      <CopyButton value={link} timeout={2000}>
        {({ copied, copy }) => (
          <Tooltip
            label={copied ? "Copied" : "Copy"}
            withArrow
            position="right"
          >
            <ActionIcon
              color={copied ? "teal" : "gray"}
              variant="subtle"
              onClick={copy}
            >
              {copied ? (
                <IconCheck style={{ width: rem(16) }} />
              ) : (
                <IconCopy style={{ width: rem(16) }} />
              )}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Tooltip>
  );
}
