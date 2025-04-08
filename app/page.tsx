"use client";

import { useState } from "react";
import Image from "next/image";
import { useCards } from "../hooks/useCards";
import { useDeck } from "../hooks/useDeck";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
            <h2 className="text-xl font-bold mb-4">
              デッキ（{totalCards}/20枚）
            </h2>

            <ScrollArea className="">
              <div className="flex">
                {deck.map((card) => (
                  <div
                    key={card.id}
                    className="w-20 neumorphism relative"
                    onClick={() => removeCardFromDeck(card.id)}
                  >
                    <Image
                      src="/imgs/cards/original.png"
                      alt={""}
                      width={315}
                      height={440}
                      className="brightness-0"
                    />
                    <p className="absolute top-5 left-5 text-white">
                      {card.name + card.count}
                    </p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <CardAction className="w-full flex justify-center gap-6 mt-5">
              <Input
                type="text"
                placeholder="デッキ名を入力..."
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
              />
              <Button
                onClick={saveDeck}
                disabled={totalCards !== 20 || !deckName}
                className=""
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
