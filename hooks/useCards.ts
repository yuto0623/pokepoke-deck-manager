import { useState, useEffect } from "react";

export interface Card {
  id: string;
  name: string;
  type: string;
  hp: number;
  stage: string;
  attacks: {
    name: string;
    cost: string[];
    damage: number;
    effect: string;
  }[];
  weakness: string;
  resistance: string;
  retreat: number;
  imageUrl: string;
  regulation: string;
}

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/data/cards.json");
        if (!response.ok) {
          throw new Error(`カードデータの取得に失敗しました: ${response.status}`);
        }
        const data = await response.json();
        setCards(data.cards);
      } catch (err) {
        console.error("カードデータの読み込みに失敗しました:", err);
        setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return { cards, loading, error };
}
