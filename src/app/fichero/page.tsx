import type { Metadata } from "next";
import { Fichero } from "@/components/cards/fichero";

export const metadata: Metadata = {
  title: "Fichero · ShipNLearn",
  description: "Tu colección de fichas: qué es cada elemento y propiedad, y cuándo usarlo.",
};

export default function FicheroPage() {
  return <Fichero />;
}
