"use client";
import { getProjectById, Project } from "@/app/api-services/projectServices";
import TeamViewTabs from "@/app/components/tabs/TeamViewTabs";
import { Tabs, Title } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TeamViewPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  const router = useRouter();
  const handleProjDetails = () => {
    router.push(`/admin/projects/${projectId}`);
  };
  const handleTeamFinder = () => {
    router.push(`/admin/projects/${projectId}/teamfinder`);
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
      <Tabs variant="pills" defaultValue="teamView" mt="md">
        <Tabs.List>
          <Tabs.Tab value="projDetails" onClick={handleProjDetails}>
            Project Details
          </Tabs.Tab>
          <Tabs.Tab value="teamFinder" onClick={handleTeamFinder}>
            Team Finder
          </Tabs.Tab>
          <Tabs.Tab value="teamView">Team view</Tabs.Tab>
          <Tabs.Tab value="assignments" onClick={handleAssign}>
            Assignments pproposals
          </Tabs.Tab>
          <Tabs.Tab value="deallocations" onClick={handleDeal}>
            Deallocations proposals
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="teamView">
          <TeamViewTabs projectId={projectId.toString()} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default TeamViewPage;
