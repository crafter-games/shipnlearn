import { cssCards } from "@/content/cards/css";
import { htmlCards } from "@/content/cards/html";
import type { ConceptCard, WorldId } from "./types";

/** Every concept card, in teaching order (Fichero order). */
export const allCards: ConceptCard[] = [...htmlCards, ...cssCards];

export const getCard = (id: string) => allCards.find((c) => c.id === id);

export const cardsOfWorld = (worldId: WorldId) => allCards.filter((c) => c.worldId === worldId);
