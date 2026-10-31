import { cssCards } from "@/content/cards/css";
import { cssAdvancedCards } from "@/content/cards/css-advanced";
import { cssIntermediateCards } from "@/content/cards/css-intermediate";
import { htmlCards } from "@/content/cards/html";
import { htmlAdvancedCards } from "@/content/cards/html-advanced";
import { htmlIntermediateCards } from "@/content/cards/html-intermediate";
import type { ConceptCard, WorldId } from "./types";

/** Every concept card, in teaching order (Fichero order). */
export const allCards: ConceptCard[] = [
  ...htmlCards,
  ...cssCards,
  ...htmlIntermediateCards,
  ...cssIntermediateCards,
  ...htmlAdvancedCards,
  ...cssAdvancedCards,
];

export const getCard = (id: string) => allCards.find((c) => c.id === id);

export const cardsOfWorld = (worldId: WorldId) => allCards.filter((c) => c.worldId === worldId);
