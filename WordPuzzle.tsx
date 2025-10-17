'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface WordPuzzleProps {
  onComplete: (success: boolean) => void;
}

interface Puzzle {
  word: string;
  hint: string;
  scrambled: string;
}

const CRYPTO_WORDS: Puzzle[] = [
  { word: 'BLOCKCHAIN', hint: 'Distributed ledger technology', scrambled: 'KCALBNIOHC' },
  { word: 'ETHEREUM', hint: 'Smart contract platform', scrambled: 'MEHTRUEE' },
  { word: 'DEFI', hint: 'Decentralized Finance (abbreviation)', scrambled: 'IEFD' },
  { word: 'WALLET', hint: 'Stores your crypto assets', scrambled: 'TELLAW' },
  { word: 'TOKEN', hint: 'Digital asset on blockchain', scrambled: 'NETOK' },
  { word: 'MINING', hint: 'Process of validating transactions', scrambled: 'NINGIM' },
  { word: 'STAKING', hint: 'Locking tokens to earn rewards', scrambled: 'KNITGAS' },
  { word: 'BRIDGE', hint: 'Connects different blockchains', scrambled: 'GERBDI' },
];

export function WordPuzzle({ onComplete }: WordPuzzleProps) {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [hintsUsed, setHintsUsed] = useState<number>(0);

  // Initialize puzzles
  useEffect(() => {
    const shuffled = [...CRYPTO_WORDS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    setPuzzles(shuffled);
  }, []);

  // Timer
  useEffect(() => {
    if (puzzles.length === 0 || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up
          const passed = score >= 3;
          onComplete(passed);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [puzzles, timeLeft, score, onComplete]);

  const handleSubmit = (): void => {
    if (!userAnswer.trim() || puzzles.length === 0) return;

    const correct = userAnswer.toUpperCase() === puzzles[currentIndex].word;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = (): void => {
    if (currentIndex < puzzles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // Puzzle complete
      const passed = score + (isCorrect ? 1 : 0) >= 3;
      setTimeout(() => {
        onComplete(passed);
      }, 1000);
    }
  };

  const handleRevealLetter = (): void => {
    if (puzzles.length === 0 || hintsUsed >= 3) return;
    
    const word = puzzles[currentIndex].word;
    const currentAnswer = userAnswer.toUpperCase();
    
    for (let i = 0; i < word.length; i++) {
      if (currentAnswer[i] !== word[i]) {
        setUserAnswer(currentAnswer.substring(0, i) + word[i] + currentAnswer.substring(i + 1));
        setHintsUsed(hintsUsed + 1);
        break;
      }
    }
  };

  if (puzzles.length === 0) {
    return <div className="text-white font-mono">Loading puzzle...</div>;
  }

  const currentPuzzle = puzzles[currentIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-2">
            <span className="text-xs font-mono text-white uppercase tracking-wider">MEDIUM DIFFICULTY</span>
          </div>
          <h3 className="text-xl font-bold text-white font-mono">CRYPTO WORD PUZZLE</h3>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-slate-400 font-mono">
            TIME: <span className={`font-bold ${timeLeft <= 20 ? 'text-red-400' : 'text-blue-400'}`}>{timeLeft}s</span>
          </p>
          <p className="text-sm text-slate-400 font-mono">
            PUZZLE: <span className="text-purple-400 font-bold">{currentIndex + 1}/{puzzles.length}</span>
          </p>
          <p className="text-sm text-slate-400 font-mono">
            SCORE: <span className="text-green-400 font-bold">{score}</span>
          </p>
        </div>
      </div>

      {/* Game Board */}
      <Card className="crypto-card border-purple-500/30">
        <CardContent className="pt-6 space-y-6">
          {/* Scrambled Word */}
          <div className="text-center space-y-4">
            <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <p className="text-sm text-slate-400 font-mono mb-2 uppercase">Scrambled Word</p>
              <p className="text-4xl font-bold text-white font-mono tracking-widest">
                {currentPuzzle.scrambled}
              </p>
            </div>

            {/* Hint */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <p className="text-sm text-slate-400 font-mono mb-1 uppercase">Hint</p>
              <p className="text-white font-mono">{currentPuzzle.hint}</p>
            </div>
          </div>

          {/* Input */}
          {!showResult ? (
            <div className="space-y-3">
              <Input
                type="text"
                value={userAnswer}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="text-center text-2xl font-bold font-mono bg-slate-800 border-slate-600 text-white uppercase"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                maxLength={currentPuzzle.word.length}
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleRevealLetter}
                  variant="outline"
                  className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400 font-mono"
                  disabled={hintsUsed >= 3}
                >
                  REVEAL LETTER ({3 - hintsUsed} left)
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-mono"
                  disabled={!userAnswer.trim()}
                >
                  SUBMIT
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                <p className={`font-semibold font-mono text-center ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? '✓ CORRECT!' : '✗ INCORRECT'}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-slate-300 mt-2 font-mono text-center">
                    Correct answer: <span className="text-white font-bold">{currentPuzzle.word}</span>
                  </p>
                )}
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 font-mono"
              >
                {currentIndex < puzzles.length - 1 ? 'NEXT PUZZLE' : 'FINISH'}
              </Button>
            </div>
          )}

          {/* Score Requirement */}
          <div className="text-xs text-slate-500 text-center font-mono border-t border-slate-700 pt-3">
            PASSING SCORE: 3/{puzzles.length} CORRECT
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
