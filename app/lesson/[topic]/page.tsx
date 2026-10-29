import { notFound } from "next/navigation";
import LessonExperience from "@/components/LessonExperience";
import { getTopicWords, isTopicId, topicIds } from "@/lib/words";

export function generateStaticParams() {
  return topicIds.map((topic) => ({ topic }));
}

export const dynamicParams = false;

export default async function LessonPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!isTopicId(topic)) notFound();
  const words = getTopicWords(topic);

  if (!words) notFound();

  return <LessonExperience topic={topic} words={words} />;
}
