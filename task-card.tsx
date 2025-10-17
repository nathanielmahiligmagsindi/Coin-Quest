'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { TaskType, DifficultyLevel } from '@/lib/contracts';
import { TASK_TYPE_LABELS, DIFFICULTY_POINTS } from '@/lib/contracts';
import { QuizGame } from '@/components/games/QuizGame';
import { MemoryGame } from '@/components/games/MemoryGame';
import { PatternGame } from '@/components/games/PatternGame';
import { WordPuzzle } from '@/components/games/WordPuzzle';

interface TaskCardProps {
  taskType: TaskType;
  taskTitle: string;
  difficulty: DifficultyLevel;
  pointsReward: number;
  isCompleted: boolean;
  onComplete: () => Promise<void>;
}

const TASK_TYPE_COLORS: Record<TaskType, string> = {
  0: 'from-cyan-500 to-blue-500',
  1: 'from-purple-500 to-pink-500',
  2: 'from-pink-500 to-red-500',
  3: 'from-yellow-500 to-orange-500',
};

export function TaskCard({ 
  taskType, 
  taskTitle, 
  difficulty,
  pointsReward, 
  isCompleted,
  onComplete 
}: TaskCardProps) {
  const [showGame, setShowGame] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleStartGame = (): void => {
    setShowGame(true);
    toast.info('Game started! Complete it to earn points.', {
      duration: 3000,
    });
  };

  const handleGameComplete = async (success: boolean): Promise<void> => {
    setIsVerifying(true);
    
    try {
      if (success) {
        await onComplete();
        toast.success('Challenge completed!', { 
          description: `You earned ${pointsReward} points!`
        });
        setShowGame(false);
      } else {
        toast.error('Challenge failed!', {
          description: 'Try again to earn points.',
        });
        setShowGame(false);
      }
    } catch (error: unknown) {
      console.error('Failed to complete task:', error);
      toast.error('Failed to verify task completion');
    } finally {
      setIsVerifying(false);
    }
  };

  const typeLabel = TASK_TYPE_LABELS[taskType];
  const colorGradient = TASK_TYPE_COLORS[taskType];

  const getDifficultyColor = (): string => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };

  const renderGame = (): React.JSX.Element | null => {
    switch (taskType) {
      case 0: // QUIZ
        return <QuizGame difficulty={difficulty} onComplete={handleGameComplete} />;
      case 1: // MEMORY
        return <MemoryGame onComplete={handleGameComplete} />;
      case 2: // PATTERN
        return <PatternGame onComplete={handleGameComplete} />;
      case 3: // WORD
        return <WordPuzzle onComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  if (showGame && !isCompleted) {
    return (
      <Card className="w-full crypto-card border-purple-500/30 scan-lines">
        <CardContent className="pt-6">
          <div className="mb-6">
            <Button
              onClick={() => setShowGame(false)}
              variant="outline"
              size="sm"
              className="border-gray-700 bg-gray-900/50 text-white hover:bg-gray-800 font-mono backdrop-blur-xl"
            >
              ← BACK TO DASHBOARD
            </Button>
          </div>
          {renderGame()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full crypto-card border-purple-500/30 scan-lines neon-button">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              <div className={`inline-block px-4 py-1.5 bg-gradient-to-r ${colorGradient} rounded-full`}>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">{typeLabel}</span>
              </div>
              <Badge variant="secondary" className={`${getDifficultyColor()} font-mono uppercase px-3`}>
                {difficulty}
              </Badge>
            </div>
            <CardTitle className="text-3xl font-black text-white glow-text mb-2">{taskTitle}</CardTitle>
            <CardDescription className="text-gray-400 font-mono text-xs uppercase tracking-wider">
              Interactive Challenge • Skill-Based Rewards
            </CardDescription>
          </div>
          <Badge 
            variant={isCompleted ? 'default' : 'secondary'} 
            className={`${isCompleted ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-gray-800 text-gray-400 border-gray-700'} font-mono font-bold px-4 py-2 text-sm`}
          >
            +{pointsReward} PTS
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {isCompleted ? (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 shimmer">
            <p className="text-green-400 font-bold text-center font-mono text-lg">
              ✓ CHALLENGE COMPLETED • REWARD CLAIMED
            </p>
          </div>
        ) : (
          <>
            {/* Game Description */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-5 text-sm backdrop-blur-xl">
              <p className="text-cyan-400 font-bold mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-lg">📋</span> Challenge Details:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 list-disc">
                {taskType === 0 && (
                  <>
                    <li>Answer crypto knowledge questions</li>
                    <li>Difficulty: {difficulty === 'easy' ? '3 questions' : difficulty === 'medium' ? '4 questions' : '5 questions'}</li>
                    <li>Pass: {difficulty === 'easy' ? '2/3' : difficulty === 'medium' ? '3/4' : '4/5'} correct</li>
                  </>
                )}
                {taskType === 1 && (
                  <>
                    <li>Match pairs of crypto symbols</li>
                    <li>8 pairs to match before time runs out</li>
                    <li>Time limit: 60 seconds</li>
                  </>
                )}
                {taskType === 2 && (
                  <>
                    <li>Memorize and recreate patterns</li>
                    <li>5 rounds of increasing difficulty</li>
                    <li>Pass: 3/5 rounds correct</li>
                  </>
                )}
                {taskType === 3 && (
                  <>
                    <li>Unscramble crypto-related words</li>
                    <li>5 puzzles with hints provided</li>
                    <li>Pass: 3/5 puzzles correct • 90 second limit</li>
                  </>
                )}
              </ul>
            </div>

            {/* Start Button */}
            <Button 
              onClick={handleStartGame}
              className={`w-full font-mono font-bold text-base bg-gradient-to-r ${colorGradient} hover:opacity-90 py-6 neon-button uppercase tracking-wider`}
              disabled={isVerifying}
            >
              {isVerifying ? '⏳ LOADING...' : '🚀 START CHALLENGE'}
            </Button>

            {/* Reward Info */}
            <div className="text-xs text-gray-600 text-center font-mono border-t border-gray-800 pt-4 uppercase tracking-wider">
              Complete the challenge to earn {pointsReward} points
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
