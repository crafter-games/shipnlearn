import { WorldMap } from "@/components/map/world-map";
import { PageTransition } from "@/components/ui/page-transition";

export default function Home() {
  return (
    <PageTransition>
      <WorldMap />
    </PageTransition>
  );
}
