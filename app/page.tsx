"use client";

import { useState } from "react";
import Image from "next/image";
import { useCards } from "./hooks/useCards";
import { useDeck } from "./hooks/useDeck";

export default function Home() {
  const { cards, loading, error } = useCards();
  const {
    deck,
    deckName,
    setDeckName,
    totalCards,
    addCardToDeck,
    removeCardFromDeck,
    saveDeck,
  } = useDeck();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ポケカ デッキビルダー</h1>

      <div className="">
        {/* 上側：デッキエリア */}
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
            デッキ（{totalCards}/20枚）
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
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={totalCards !== 20 || !deckName}
          >
            デッキを保存
          </button>
        </div>

        {/* 下側：カード検索エリア */}
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
      </div>
    </div>
  );
}
