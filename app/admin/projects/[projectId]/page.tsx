"use client";
import {
  getMembersByProjectId,
  getProjectById,
  Project,
  ViewProjectTeam,
} from "@/app/api-services/projectServices";
import ProjectDetailsCards from "@/app/components/cards/ProjectDetailsCards";
import ProjectMembersCard from "@/app/components/cards/ProjectMembersCard";
import { Tabs, Title } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<ViewProjectTeam>();

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        try {
          const projectData = await getProjectById(projectId.toString());
          setProject(projectData);
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    const fetchMembers = async () => {
      if (projectId) {
        try {
          const projectMembers = await getMembersByProjectId(
            projectId.toString()
          );
          if (projectMembers) setMembers(projectMembers);
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMembers();
    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  const router = useRouter();
  const handleTeamFinder = () => {
    router.push(`/admin/projects/${projectId}/teamfinder`);
  };
  const handleTeamView = () => {
    router.push(`/admin/projects/${projectId}/teamview`);
  };
  const handleAssign = () => {
    router.push(`/admin/projects/${projectId}/assignments-proposals`);
  };
  const handleDeal = () => {
    router.push(`/admin/projects/${projectId}/deallocation-proposals`);
  };
  return (
    <div>
      <Title order={3}>Project: {project?.projectName}</Title>
      <Tabs variant="pills" defaultValue="projDetails" mt="md">
        <Tabs.List>
          <Tabs.Tab value="projDetails">Project Details</Tabs.Tab>
          <Tabs.Tab value="teamFinder" onClick={handleTeamFinder}>
            Team Finder
          </Tabs.Tab>
          <Tabs.Tab value="teamView" onClick={handleTeamView}>
            Team view
          </Tabs.Tab>
          <Tabs.Tab value="assignments" onClick={handleAssign}>
            Assignments pproposals
          </Tabs.Tab>
          <Tabs.Tab value="deallocations" onClick={handleDeal}>
            Deallocations proposals
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="projDetails">
          <ProjectDetailsCards project={project ? project : undefined} />
          <Title order={3} mt="lg">
            Members
          </Title>
          <ProjectMembersCard members={members} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ProjectPage;
