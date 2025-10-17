'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { DifficultyLevel } from '@/lib/contracts';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizGameProps {
  difficulty: DifficultyLevel;
  onComplete: (success: boolean) => void;
}

const QUIZ_DATA: Record<DifficultyLevel, QuizQuestion[]> = {
  easy: [
    {
      question: 'What does DeFi stand for?',
      options: ['Digital Finance', 'Decentralized Finance', 'Direct Finance', 'Distributed Finance'],
      correctAnswer: 1,
    },
    {
      question: 'What blockchain is this dApp built on?',
      options: ['Ethereum', 'Polygon', 'Base', 'Arbitrum'],
      correctAnswer: 2,
    },
    {
      question: 'What is a wallet used for in crypto?',
      options: ['Storing paper money', 'Storing crypto assets', 'Playing games', 'Sending emails'],
      correctAnswer: 1,
    },
  ],
  medium: [
    {
      question: 'What is Base?',
      options: ['A programming language', 'An Ethereum Layer 2 solution', 'A cryptocurrency', 'A wallet provider'],
      correctAnswer: 1,
    },
    {
      question: 'What does "gas fee" refer to in blockchain?',
      options: ['Car fuel cost', 'Transaction processing fee', 'Heating bill', 'Network subscription'],
      correctAnswer: 1,
    },
    {
      question: 'What is an ERC-20 token?',
      options: ['A Bitcoin standard', 'Ethereum token standard', 'A mining algorithm', 'A wallet type'],
      correctAnswer: 1,
    },
    {
      question: 'What is a smart contract?',
      options: ['A legal document', 'Self-executing code on blockchain', 'A business agreement', 'A crypto wallet'],
      correctAnswer: 1,
    },
  ],
  hard: [
    {
      question: 'What consensus mechanism does Ethereum use after The Merge?',
      options: ['Proof of Work', 'Proof of Stake', 'Proof of Authority', 'Delegated Proof of Stake'],
      correctAnswer: 1,
    },
    {
      question: 'What is an L2 scaling solution?',
      options: ['A second blockchain', 'A layer built on top of L1 for scalability', 'A type of token', 'A wallet feature'],
      correctAnswer: 1,
    },
    {
      question: 'What does TVL stand for in DeFi?',
      options: ['Total Value Locked', 'Transaction Value Limit', 'Token Verification Level', 'Trading Volume Limit'],
      correctAnswer: 0,
    },
    {
      question: 'What is a zk-rollup?',
      options: ['A token type', 'A scaling solution using zero-knowledge proofs', 'A wallet feature', 'A mining method'],
      correctAnswer: 1,
    },
    {
      question: 'What is the purpose of Base being built by Coinbase?',
      options: ['To compete with Bitcoin', 'To provide a secure, low-cost L2 for developers', 'To replace Ethereum', 'To create a new cryptocurrency'],
      correctAnswer: 1,
    },
  ],
};

export function QuizGame({ difficulty, onComplete }: QuizGameProps) {
  const questions = QUIZ_DATA[difficulty];
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const requiredScore = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;

  const handleAnswerSelect = (index: number): void => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = (): void => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // Quiz complete
      const passed = score + (isCorrect ? 1 : 0) >= requiredScore;
      setTimeout(() => {
        onComplete(passed);
      }, 1000);
    }
  };

  const getDifficultyColor = (): string => {
    switch (difficulty) {
      case 'easy':
        return 'from-green-500 to-emerald-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'hard':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className={`inline-block px-3 py-1 bg-gradient-to-r ${getDifficultyColor()} rounded-full mb-2`}>
            <span className="text-xs font-mono text-white uppercase tracking-wider">
              {difficulty} DIFFICULTY
            </span>
          </div>
          <h3 className="text-xl font-bold text-white font-mono">CRYPTO KNOWLEDGE QUIZ</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 font-mono">QUESTION {currentQuestion + 1}/{questions.length}</p>
          <p className="text-lg font-bold text-blue-400 font-mono">SCORE: {score}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-slate-500 text-right font-mono">{Math.floor(progress)}% COMPLETE</p>
      </div>

      {/* Question Card */}
      <Card className="crypto-card border-purple-500/30">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <p className="text-lg text-white font-semibold">
              {questions[currentQuestion].question}
            </p>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option: string, index: number) => {
                const isSelected = selectedAnswer === index;
                const isAnswered = showResult;
                const isCorrectAnswer = index === questions[currentQuestion].correctAnswer;
                
                let buttonClass = 'border-slate-600 text-white hover:bg-slate-700';
                
                if (isAnswered) {
                  if (isCorrectAnswer) {
                    buttonClass = 'border-green-500 bg-green-500/20 text-green-400';
                  } else if (isSelected && !isCorrectAnswer) {
                    buttonClass = 'border-red-500 bg-red-500/20 text-red-400';
                  }
                } else if (isSelected) {
                  buttonClass = 'border-purple-500 bg-purple-500/20 text-purple-400';
                }

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full justify-start text-left h-auto py-4 font-mono ${buttonClass}`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                );
              })}
            </div>
          </div>

          {showResult && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              <p className={`font-semibold font-mono ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '✓ CORRECT!' : '✗ INCORRECT'}
              </p>
              {!isCorrect && (
                <p className="text-sm text-slate-300 mt-1 font-mono">
                  Correct answer: {String.fromCharCode(65 + questions[currentQuestion].correctAnswer)}. {questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {!showResult ? (
              <Button
                onClick={handleSubmitAnswer}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-mono"
                disabled={selectedAnswer === null}
              >
                SUBMIT ANSWER
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className={`w-full bg-gradient-to-r ${getDifficultyColor()} font-mono`}
              >
                {currentQuestion < questions.length - 1 ? 'NEXT QUESTION' : 'FINISH QUIZ'}
              </Button>
            )}
          </div>

          {/* Score Requirement */}
          <div className="text-xs text-slate-500 text-center font-mono border-t border-slate-700 pt-3">
            PASSING SCORE: {requiredScore}/{questions.length} CORRECT
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
