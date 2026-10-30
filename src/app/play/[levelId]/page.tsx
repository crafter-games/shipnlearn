import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LevelScreen } from "@/components/level/level-screen";
import { allLevels, getLevel } from "@/lib/levels/registry";

export function generateStaticParams() {
  return allLevels.map((l) => ({ levelId: l.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/play/[levelId]">): Promise<Metadata> {
  const { levelId } = await params;
  const level = getLevel(levelId);
  return { title: level ? `${level.title} · ShipNLearn` : "ShipNLearn" };
}

export default async function PlayPage({ params }: PageProps<"/play/[levelId]">) {
  const { levelId } = await params;
  if (!getLevel(levelId)) notFound();
  return <LevelScreen levelId={levelId} />;
}
