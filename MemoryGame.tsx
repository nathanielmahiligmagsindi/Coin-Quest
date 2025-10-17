'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MemoryGameProps {
  onComplete: (success: boolean) => void;
}

interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CRYPTO_SYMBOLS = ['Ξ', '₿', '◊', '⟠', '⬡', '◈', '⬢', '⬣'];

export function MemoryGame({ onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up - check if they won
          if (matches === CRYPTO_SYMBOLS.length) {
            onComplete(true);
          } else {
            onComplete(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, matches, onComplete]);

  // Check for win condition
  useEffect(() => {
    if (matches === CRYPTO_SYMBOLS.length && gameStarted) {
      setTimeout(() => {
        onComplete(true);
      }, 500);
    }
  }, [matches, gameStarted, onComplete]);

  const initializeGame = (): void => {
    const symbols = CRYPTO_SYMBOLS;
    const gameCards = [...symbols, ...symbols]
      .map((symbol: string, index: number) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimeLeft(60);
    setGameStarted(false);
  };

  const handleCardClick = (cardId: number): void => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (isChecking || flippedCards.length >= 2) return;

    const card = cards.find((c: MemoryCard) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(cards.map((c: MemoryCard) => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c: MemoryCard) => c.id === firstId);
      const secondCard = cards.find((c: MemoryCard) => c.id === secondId);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setCards(cards.map((c: MemoryCard) => 
          c.id === firstId || c.id === secondId 
            ? { ...c, isMatched: true }
            : c
        ));
        setMatches(matches + 1);
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setCards(cards.map((c: MemoryCard) => 
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const getCardColor = (card: MemoryCard): string => {
    if (card.isMatched) return 'border-green-500 bg-green-500/20';
    if (card.isFlipped) return 'border-purple-500 bg-purple-500/20';
    return 'border-slate-600 bg-slate-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-2">
            <span className="text-xs font-mono text-white uppercase tracking-wider">MEDIUM DIFFICULTY</span>
          </div>
          <h3 className="text-xl font-bold text-white font-mono">CRYPTO MEMORY MATCH</h3>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-slate-400 font-mono">
            TIME: <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-blue-400'}`}>{timeLeft}s</span>
          </p>
          <p className="text-sm text-slate-400 font-mono">
            MOVES: <span className="text-purple-400 font-bold">{moves}</span>
          </p>
          <p className="text-sm text-slate-400 font-mono">
            MATCHES: <span className="text-green-400 font-bold">{matches}/{CRYPTO_SYMBOLS.length}</span>
          </p>
        </div>
      </div>

      {/* Game Board */}
      <Card className="crypto-card border-purple-500/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card: MemoryCard) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || card.isFlipped || isChecking}
                className={`aspect-square rounded-lg border-2 transition-all duration-300 ${getCardColor(card)} hover:scale-105 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-center h-full">
                  {(card.isFlipped || card.isMatched) ? (
                    <span className="text-4xl">{card.symbol}</span>
                  ) : (
                    <span className="text-2xl text-slate-600">?</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-slate-300 font-mono text-center">
              Match all crypto symbols before time runs out
            </p>
          </div>

          {/* Reset Button */}
          <Button
            onClick={initializeGame}
            variant="outline"
            className="w-full mt-4 border-slate-600 text-white hover:bg-slate-700 font-mono"
          >
            RESTART GAME
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
