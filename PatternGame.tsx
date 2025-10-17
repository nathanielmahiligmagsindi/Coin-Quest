'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PatternGameProps {
  onComplete: (success: boolean) => void;
}

const GRID_SIZE = 4;
const TOTAL_ROUNDS = 5;
const CELL_SHOW_TIME = 600; // Time each cell is highlighted
const CELL_GAP_TIME = 200; // Gap between cells

export function PatternGame({ onComplete }: PatternGameProps) {
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'memorize' | 'input' | 'result'>('memorize');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState<number>(-1);

  // Generate new pattern for current round
  useEffect(() => {
    generateNewPattern();
  }, [currentRound]);

  // Handle sequential pattern display
  useEffect(() => {
    if (gamePhase === 'memorize' && pattern.length > 0) {
      showPatternSequentially();
    }
  }, [gamePhase, pattern]);

  const showPatternSequentially = async (): Promise<void> => {
    // Show each cell in the pattern one by one
    for (let i = 0; i < pattern.length; i++) {
      setCurrentHighlightIndex(i);
      await new Promise(resolve => setTimeout(resolve, CELL_SHOW_TIME));
      setCurrentHighlightIndex(-1);
      await new Promise(resolve => setTimeout(resolve, CELL_GAP_TIME));
    }
    
    // After all cells shown, switch to input phase
    setGamePhase('input');
  };

  const generateNewPattern = (): void => {
    const patternLength = Math.min(3 + currentRound, 8);
    const newPattern: number[] = [];
    const gridSize = GRID_SIZE * GRID_SIZE;

    for (let i = 0; i < patternLength; i++) {
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * gridSize);
      } while (newPattern.includes(randomIndex));
      newPattern.push(randomIndex);
    }

    setPattern(newPattern);
    setUserPattern([]);
    setCurrentHighlightIndex(-1);
    setGamePhase('memorize');
  };

  const handleCellClick = (index: number): void => {
    if (gamePhase !== 'input') return;
    
    // Prevent clicking the same cell twice
    if (userPattern.includes(index)) return;

    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);

    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      checkPattern(newUserPattern);
    }
  };

  const handleClearPattern = (): void => {
    setUserPattern([]);
  };

  const checkPattern = (userPat: number[]): void => {
    const correct = userPat.every((val: number, idx: number) => val === pattern[idx]);
    setIsCorrect(correct);
    setGamePhase('result');

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(currentRound + 1);
      } else {
        // Game complete
        const passed = score + (correct ? 1 : 0) >= 3;
        setTimeout(() => {
          onComplete(passed);
        }, 1000);
      }
    }, 1500);
  };

  const getCellColor = (index: number): string => {
    // During memorize phase, only highlight the current cell in sequence
    if (gamePhase === 'memorize' && currentHighlightIndex >= 0 && pattern[currentHighlightIndex] === index) {
      return 'border-purple-500 bg-purple-500/60 shadow-lg shadow-purple-500/50 scale-110';
    }
    
    if (gamePhase === 'input' && userPattern.includes(index)) {
      return 'border-blue-500 bg-blue-500/40';
    }

    if (gamePhase === 'result') {
      if (pattern.includes(index)) {
        return 'border-green-500 bg-green-500/40';
      }
      if (userPattern.includes(index) && !pattern.includes(index)) {
        return 'border-red-500 bg-red-500/40';
      }
    }

    return 'border-slate-600 bg-slate-800 hover:bg-slate-700';
  };

  const progress = (currentRound / TOTAL_ROUNDS) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-2">
            <span className="text-xs font-mono text-white uppercase tracking-wider">HARD DIFFICULTY</span>
          </div>
          <h3 className="text-xl font-bold text-white font-mono">PATTERN RECOGNITION</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 font-mono">ROUND {currentRound}/{TOTAL_ROUNDS}</p>
          <p className="text-lg font-bold text-purple-400 font-mono">SCORE: {score}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-slate-500 text-right font-mono">{Math.floor(progress)}% COMPLETE</p>
      </div>

      {/* Game Board */}
      <Card className="crypto-card border-purple-500/30">
        <CardContent className="pt-6 space-y-6">
          {/* Status Message */}
          <div className="text-center space-y-2">
            {gamePhase === 'memorize' && (
              <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <p className="font-bold text-purple-400 font-mono">MEMORIZE THE SEQUENCE</p>
                <p className="text-sm text-slate-300 font-mono mt-1">
                  Watch cells light up one by one • Pattern Length: {pattern.length}
                </p>
                <p className="text-xs text-purple-300 font-mono mt-2">
                  Showing: {currentHighlightIndex + 1}/{pattern.length}
                </p>
              </div>
            )}
            {gamePhase === 'input' && (
              <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <p className="font-bold text-blue-400 font-mono">RECREATE THE SEQUENCE</p>
                <p className="text-sm text-slate-300 font-mono mt-1">
                  Click cells in the same order they appeared • Selected: {userPattern.length}/{pattern.length}
                </p>
              </div>
            )}
            {gamePhase === 'result' && (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                <p className={`font-bold font-mono ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? '✓ CORRECT!' : '✗ INCORRECT'}
                </p>
              </div>
            )}
          </div>

          {/* Clear Button */}
          {gamePhase === 'input' && userPattern.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleClearPattern}
                variant="outline"
                size="sm"
                className="bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400 font-mono"
              >
                CLEAR SELECTION
              </Button>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index: number) => {
              const clickOrder = userPattern.indexOf(index) + 1;
              const isClicked = userPattern.includes(index);
              
              return (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={gamePhase !== 'input' || isClicked}
                  className={`aspect-square rounded-lg border-2 transition-all duration-300 ${getCellColor(index)} disabled:cursor-not-allowed relative flex items-center justify-center`}
                >
                  {gamePhase === 'input' && isClicked && (
                    <span className="text-2xl font-bold text-blue-300 font-mono">
                      {clickOrder}
                    </span>
                  )}
                  {gamePhase === 'result' && pattern.includes(index) && (
                    <span className="text-2xl font-bold text-green-300 font-mono">
                      {pattern.indexOf(index) + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-xs text-slate-300 font-mono text-center">
              Watch the cells light up ONE BY ONE in sequence, then click them in the same order
            </p>
          </div>

          {/* Score Requirement */}
          <div className="text-xs text-slate-500 text-center font-mono border-t border-slate-700 pt-3">
            PASSING SCORE: 3/{TOTAL_ROUNDS} CORRECT
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
