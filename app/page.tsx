"use client";

import { useState } from "react";
import Image from "next/image";
import { useCards } from "../hooks/useCards";
import { useDeck } from "../hooks/useDeck";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <div className="grid gap-8">
        {/* 上側：デッキエリア */}
        <Card className="sticky top-6 z-10">
          <CardContent>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="デッキ名を入力..."
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
              />
            </div>

            <h2 className="text-xl font-bold mb-4">
              デッキ（{totalCards}/20枚）
            </h2>

            <div className="flex flex-col flex-wrap gap-4 h-40 overflow-x-scroll">
              {deck.map((card) => (
                <div
                  key={card.id}
                  className="h-[40%] flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
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

            <CardAction>
              <Button
                onClick={saveDeck}
                disabled={totalCards !== 20 || !deckName}
              >
                デッキを保存
              </Button>
            </CardAction>
          </CardContent>
        </Card>

        {/* 下側：カード検索エリア */}
        <div className="">
          <div className="mb-6">
            <Input
              type="text"
              placeholder="カード名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div>読み込み中...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCards.map((card) => (
                <Card
                  key={card.id}
                  className="border rounded-lg p-4 transition-shadow cursor-pointer"
                  onClick={() => addCardToDeck(card)}
                >
                  <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
                  <div className="text-gray-600">
                    <p>タイプ: {card.type}</p>
                    <p>HP: {card.hp}</p>
                    <p>ステージ: {card.stage}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
