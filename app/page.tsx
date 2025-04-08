"use client";

import { useState } from "react";
import Image from "next/image";
import { useCards } from "../hooks/useCards";
import { useDeck } from "../hooks/useDeck";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FaPlus } from "react-icons/fa6";

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
        <Card className="sticky top-6 z-10 overflow-auto">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">
              デッキ（{totalCards}/20枚）
            </h2>

            <ScrollArea className="">
              <div className="w-fit mx-auto py-2 2xl:overflow-y-hidden">
                <div className="grid grid-cols-[repeat(10,70px)] grid-rows-2 2xl:grid-rows-1 2xl:grid-cols-20 gap-2 w-fit">
                  {deck.map((card) => (
                    <div
                      key={card.id}
                      className="neumorphism relative"
                      onClick={() => removeCardFromDeck(card.id)}
                    >
                      <Image
                        src={card.imageUrl}
                        alt={""}
                        width={315}
                        height={440}
                        // className="brightness-0"
                      />
                      <p className="absolute top-5 left-5 text-white">
                        {card.name + card.count}
                      </p>
                    </div>
                  ))}
                  {Array(20 - deck.length)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="neumorphism-pressed relative bg-[#e1e0e7] rounded-md w-[70px] h-[98px]"
                      >
                        <FaPlus
                          size={30}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300"
                        />
                      </div>
                    ))}
                </div>
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
            <div className="grid grid-cols-2 min-[300px]:grid-cols-3 min-[500px]:grid-cols-4 min-[900px]:grid-cols-6 gap-4">
              {filteredCards.map((card) => (
                <Card
                  key={card.id}
                  className="cursor-pointer p-0 w-full"
                  onClick={() => addCardToDeck(card)}
                >
                  <CardContent className="p-0">
                    {/* <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
                  <div className="text-gray-600">
                  <p>タイプ: {card.type}</p>
                  <p>HP: {card.hp}</p>
                  <p>ステージ: {card.stage}</p>
                  </div> */}
                    {card.imageUrl && (
                      <Image
                        src={card.imageUrl}
                        alt={card.name}
                        width={315}
                        height={440}
                        // className="brightness-0"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
