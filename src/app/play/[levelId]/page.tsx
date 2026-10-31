import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LevelLoading, LevelScreen } from "@/components/level/level-screen";
import { PageTransition } from "@/components/ui/page-transition";
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

export default function PlayPage({ params }: PageProps<"/play/[levelId]">) {
  // Reading params suspends: keep it inside a boundary so navigation is instant.
  return (
    <PageTransition>
      <Suspense fallback={<LevelLoading />}>
        <PlayLevel params={params} />
      </Suspense>
    </PageTransition>
  );
}

async function PlayLevel({ params }: { params: PageProps<"/play/[levelId]">["params"] }) {
  const { levelId } = await params;
  if (!getLevel(levelId)) notFound();
  return <LevelScreen key={levelId} levelId={levelId} />;
}
