import { useState, useEffect } from "react";
import { Card } from "./useCards";

export interface DeckCard extends Card {
  count: number;
}

export interface SavedDeck {
  name: string;
  cards: DeckCard[];
  createdAt: string;
}

export function useDeck() {
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [deckName, setDeckName] = useState("");

  // 保存されたデッキを読み込む
  useEffect(() => {
    const savedDecks = localStorage.getItem("decks");
    if (savedDecks) {
      const lastDeck = JSON.parse(savedDecks)[0];
      if (lastDeck) {
        setDeck(lastDeck.cards);
        setDeckName(lastDeck.name);
      }
    }
  }, []);

  const totalCards = deck.reduce((sum, card) => sum + card.count, 0);

  const addCardToDeck = (card: Card) => {
    if (totalCards >= 20) {
      alert("デッキは20枚までです");
      return;
    }

    const existingCard = deck.find((c) => c.id === card.id);
    if (existingCard) {
      if (existingCard.count >= 2) {
        alert("同じカードは2枚までしか入れられません");
        return;
      }
      setDeck(
        deck.map((c) => (c.id === card.id ? { ...c, count: c.count + 1 } : c))
      );
    } else {
      setDeck([...deck, { ...card, count: 1 }]);
    }
  };

  const removeCardFromDeck = (cardId: string) => {
    setDeck(
      deck
        .map((card) => {
          if (card.id === cardId) {
            return { ...card, count: card.count - 1 };
          }
          return card;
        })
        .filter((card) => card.count > 0)
    );
  };

  const saveDeck = () => {
    if (!deckName) {
      alert("デッキ名を入力してください");
      return false;
    }
    if (totalCards !== 20) {
      alert("デッキは20枚である必要があります");
      return false;
    }

    const savedDecks = localStorage.getItem("decks");
    const decks = savedDecks ? JSON.parse(savedDecks) : [];

    const newDeck = {
      name: deckName,
      cards: deck,
      createdAt: new Date().toISOString(),
    };

    decks.unshift(newDeck);
    localStorage.setItem("decks", JSON.stringify(decks.slice(0, 10)));
    alert("デッキを保存しました");
    return true;
  };

  return {
    deck,
    deckName,
    setDeckName,
    totalCards,
    addCardToDeck,
    removeCardFromDeck,
    saveDeck,
  };
}
