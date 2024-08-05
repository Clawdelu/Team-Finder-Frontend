import { decodeToken } from "@/app/api-services/authService";
import { activeItemAtom } from "@/app/components/global-state";
import LogoSVG from "@/app/svg-components/LogoSVG";
import {
  Avatar,
  Button,
  Group,
  Title,
  Text,
  Tooltip,
  ActionIcon,
  rem,
} from "@mantine/core";
import {
  IconBellRinging,
  IconChartTreemap,
  IconFileText,
  IconHexagonalPrismPlus,
  IconListDetails,
  IconLogout,
  IconSwitchHorizontal,
  IconTableOptions,
  IconTopologyRing,
  IconTopologyStarRing2,
  IconUser,
  IconUsersGroup,
  IconUsersPlus,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect, useState } from "react";
import classes from "./Navbar.module.css";
import { useRouter } from "next/navigation";
import { getConnectedUser, User } from "@/app/api-services/userService";

const data = [
  { link: "/admin/dashboard", label: "Dashboard", icon: IconChartTreemap },
  { link: "/admin/employee", label: "Employee", icon: IconUser },
  { link: "/admin/teamroles", label: "Team Roles", icon: IconUsersGroup },
  {
    link: "/admin/departments",
    label: "Departments",
    icon: IconTopologyStarRing2,
  },
  {
    link: "/admin/mydepartment",
    label: "My department",
    icon: IconTopologyRing,
  },
  {
    link: "/admin/skillassignment",
    label: "Skill Assignment",
    icon: IconHexagonalPrismPlus,
  },
  { link: "/admin/skills", label: "Skills", icon: IconListDetails },
  { link: "/admin/projects", label: "Projects", icon: IconTableOptions },
  {
    link: "/admin/membersassign",
    label: "Assign members",
    icon: IconUsersPlus,
  },
  { link: "/admin/proposals", label: "Proposals", icon: IconFileText },
  //{ link: "/admin/notification", label: "Notification", icon: IconBellRinging },
];

export function Navbar() {
  const [value, setValue] = useAtom(activeItemAtom);
  const [roles, setRoles] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.roles) {
        setRoles(decoded.roles);
      }
    }
    const fetchData = async () => {
      const thisUser = await getConnectedUser();
      setUser(thisUser);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  // Exemplu aici de util
  // {roles.includes('admin') && (
  //   <li><Link href="/admin"><a>Admin Page</a></Link></li>
  // )}

  const links = data.map((item) => (
    <Link href={item.link} key={item.label} legacyBehavior>
      <a
        className={classes.link}
        data-active={item.label === value || undefined}
        onClick={(event) => {
          //event.preventDefault();
          setValue(item.label);
        }}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </a>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} align="align-center" gap="sm" mb={25}>
          <LogoSVG />
          <Title order={2}>Squad Sync</Title>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <Group>
          <Avatar
            variant="filled"
            radius="xl"
            color="dark"
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
          />
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {user?.userName}
            </Text>

            <Text c="dimmed" size="xs">
              {user?.email}
            </Text>
          </div>

          <Tooltip label="Logout" color="blue" withArrow closeDelay={30}>
            <ActionIcon variant="subtle" color="blue" onClick={handleLogout}>
              <IconLogout
                style={{ width: rem(23), height: rem(23) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
        </Group>
      </div>
    </nav>
  );
}
