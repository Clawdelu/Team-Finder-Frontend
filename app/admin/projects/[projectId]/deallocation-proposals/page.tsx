"use client";
import { getProjectById, Project } from "@/app/api-services/projectServices";
import AssignCard from "@/app/components/cards/AssignCard";
import DeallocationCard from "@/app/components/cards/DeallocationCard";
import { Tabs, Title } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DeallocationProposalsPage = () => {
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
  const handleTeamView = () => {
    router.push(`/admin/projects/${projectId}/teamview`);
  };
  const handleAssign = () => {
    router.push(`/admin/projects/${projectId}/assignments-proposals`);
  };
  return (
    <div>
      <Title order={3}>Project: {project?.projectName}</Title>
      <Tabs variant="pills" defaultValue="deallocations" mt="md">
        <Tabs.List>
          <Tabs.Tab value="projDetails" onClick={handleProjDetails}>
            Project Details
          </Tabs.Tab>
          <Tabs.Tab value="teamFinder" onClick={handleTeamFinder}>
            Team Finder
          </Tabs.Tab>
          <Tabs.Tab value="teamView" onClick={handleTeamView}>
            Team view
          </Tabs.Tab>
          <Tabs.Tab value="assignments" onClick={handleAssign}>
            Assignments proposals
          </Tabs.Tab>
          <Tabs.Tab value="deallocations">Deallocations proposals</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="deallocations">
          <DeallocationCard projectId={projectId.toString()} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default DeallocationProposalsPage;
