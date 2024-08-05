"use client";
import { getProjectById, Project } from "@/app/api-services/projectServices";
import AssignCard from "@/app/components/cards/AssignCard";
import { Tabs, Title } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AssignmentsProposalsPage = () => {
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
  const handleDeal = () => {
    router.push(`/admin/projects/${projectId}/deallocation-proposals`);
  };
  return (
    <div>
      <Title order={3}>Project: {project?.projectName}</Title>
      <Tabs variant="pills" defaultValue="assignments" mt="md">
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
          <Tabs.Tab value="assignments">Assignments proposals</Tabs.Tab>
          <Tabs.Tab value="deallocations" onClick={handleDeal}>
            Deallocations proposals
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="assignments">
          <AssignCard projectId={projectId.toString()} />
        </Tabs.Panel>
        <Tabs.Panel value="deallocations">deallocations</Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default AssignmentsProposalsPage;
