"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Card {
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

interface DeckCard extends Card {
  count: number;
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [deckName, setDeckName] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/data/cards.json");
        const data = await response.json();
        setCards(data.cards);
      } catch (error) {
        console.error("カードデータの読み込みに失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();

    // 保存されたデッキを読み込む
    const savedDecks = localStorage.getItem("decks");
    if (savedDecks) {
      const lastDeck = JSON.parse(savedDecks)[0];
      if (lastDeck) {
        setDeck(lastDeck.cards);
        setDeckName(lastDeck.name);
      }
    }
  }, []);

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCards = deck.reduce((sum, card) => sum + card.count, 0);

  const addCardToDeck = (card: Card) => {
    if (totalCards >= 60) {
      alert("デッキは60枚までです");
      return;
    }

    const existingCard = deck.find((c) => c.id === card.id);
    if (existingCard) {
      if (existingCard.count >= 4) {
        alert("同じカードは4枚までしか入れられません");
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
      return;
    }
    if (totalCards !== 60) {
      alert("デッキは60枚である必要があります");
      return;
    }

    const savedDecks = localStorage.getItem("decks");
    const decks = savedDecks ? JSON.parse(savedDecks) : [];

    const newDeck = {
      name: deckName,
      cards: deck,
      createdAt: new Date().toISOString(),
    };

    decks.unshift(newDeck); // 新しいデッキを先頭に追加
    localStorage.setItem("decks", JSON.stringify(decks.slice(0, 10))); // 最新10件まで保存
    alert("デッキを保存しました");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ポケポケ デッキマネージャー</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側：カード検索エリア */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <input
              type="text"
              placeholder="カード名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {loading ? (
            <div>読み込み中...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => addCardToDeck(card)}
                >
                  <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
                  <div className="text-gray-600">
                    <p>タイプ: {card.type}</p>
                    <p>HP: {card.hp}</p>
                    <p>ステージ: {card.stage}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右側：デッキエリア */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <input
              type="text"
              placeholder="デッキ名を入力..."
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <h2 className="text-xl font-bold mb-4">
            デッキ（{totalCards}/60枚）
          </h2>

          <div className="space-y-2 mb-4">
            {deck.map((card) => (
              <div
                key={card.id}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
              >
                <div>
                  <span className="font-medium">{card.name}</span>
                  <span className="text-gray-500 ml-2">×{card.count}</span>
                </div>
                <button
                  onClick={() => removeCardFromDeck(card.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={saveDeck}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            disabled={totalCards !== 60 || !deckName}
          >
            デッキを保存
          </button>
        </div>
      </div>
    </div>
  );
}
