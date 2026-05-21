import Header from "@/components/home/header";
import VideoPlayer from "@/components/Projects/VideoPlayer";
import { getProjectBySlug } from "@/lib/projects-data";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPlayerPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <>
  <VideoPlayer project={project} /></>;
}
