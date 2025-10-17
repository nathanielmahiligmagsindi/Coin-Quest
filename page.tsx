'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnect } from '@/components/wallet-connect';
import { TaskCard } from '@/components/task-card';
import { PointsBalance } from '@/components/points-balance';
import { RedeemCard } from '@/components/redeem-card';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { TaskType, DifficultyLevel, DIFFICULTY_POINTS } from '@/lib/contracts';
import { sdk } from "@farcaster/miniapp-sdk";

interface DailyTask {
  taskType: TaskType;
  taskTitle: string;
  difficulty: DifficultyLevel;
  pointsReward: number;
}

// Daily tasks with varying difficulties and rewards
const TASK_POOL: DailyTask[] = [
  // Easy Quiz
  {
    taskType: TaskType.QUIZ,
    taskTitle: 'Crypto Basics Quiz',
    difficulty: DifficultyLevel.EASY,
    pointsReward: DIFFICULTY_POINTS[DifficultyLevel.EASY],
  },
  // Medium Quiz
  {
    taskType: TaskType.QUIZ,
    taskTitle: 'DeFi Knowledge Test',
    difficulty: DifficultyLevel.MEDIUM,
    pointsReward: DIFFICULTY_POINTS[DifficultyLevel.MEDIUM],
  },
  // Hard Quiz
  {
    taskType: TaskType.QUIZ,
    taskTitle: 'Advanced Blockchain Quiz',
    difficulty: DifficultyLevel.HARD,
    pointsReward: DIFFICULTY_POINTS[DifficultyLevel.HARD],
  },
  // Memory Game
  {
    taskType: TaskType.MEMORY,
    taskTitle: 'Crypto Symbol Memory',
    difficulty: DifficultyLevel.MEDIUM,
    pointsReward: DIFFICULTY_POINTS[DifficultyLevel.MEDIUM],
  },
  // Pattern Game
  {
    taskType: TaskType.PATTERN,
    taskTitle: 'Blockchain Pattern Recognition',
    difficulty: DifficultyLevel.HARD,
    pointsReward: DIFFICULTY_POINTS[DifficultyLevel.HARD],
  },
  // Word Puzzle
  {
    taskType: TaskType.WORD,
    taskTitle: 'Crypto Word Challenge',
    difficulty: DifficultyLevel.MEDIUM,
    pointsReward: DIFFICULTY_POINTS[DifficultyLevel.MEDIUM],
  },
];

export default function Home() {
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          if (document.readyState !== 'complete') {
            await new Promise(resolve => {
              if (document.readyState === 'complete') {
                resolve(void 0);
              } else {
                window.addEventListener('load', () => resolve(void 0), { once: true });
              }

            });
          }

          await sdk.actions.ready();
          console.log("Farcaster SDK initialized successfully - app fully loaded");
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error);
          setTimeout(async () => {
            try {
              await sdk.actions.ready();
              console.log('Farcaster SDK initialized on retry');
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError);
            }

          }, 1000);
        }

      };
      initializeFarcaster();
    }, []);
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState<boolean>(true);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [todayTask, setTodayTask] = useState<DailyTask | null>(null);
  const [isTaskCompleted, setIsTaskCompleted] = useState<boolean>(false);

  // Load daily task based on current date
  useEffect(() => {
    const loadDailyTask = (): void => {
      const today = new Date().toDateString();
      const savedDate = localStorage.getItem('taskDate');
      const savedCompleted = localStorage.getItem('taskCompleted');

      // Reset completion if it's a new day
      if (savedDate !== today) {
        localStorage.setItem('taskDate', today);
        localStorage.removeItem('taskCompleted');
        setIsTaskCompleted(false);
      } else {
        setIsTaskCompleted(savedCompleted === 'true');
      }

      // Select task based on day of week
      const dayIndex = new Date().getDay();
      const taskIndex = dayIndex % TASK_POOL.length;
      setTodayTask(TASK_POOL[taskIndex]);
      setLoading(false);
    };

    loadDailyTask();
  }, []);

  // Load user points from localStorage
  useEffect(() => {
    if (address) {
      const storedPoints = localStorage.getItem(`points_${address}`);
      setUserPoints(storedPoints ? Number.parseInt(storedPoints, 10) : 0);
    }
  }, [address]);

  const handleCompleteTask = useCallback(async (): Promise<void> => {
    if (!todayTask || !address) return;

    // Simulate task completion and verification
    await new Promise((resolve: (value: void) => void) => setTimeout(resolve, 2000));

    // Award points
    const newPoints = userPoints + todayTask.pointsReward;
    setUserPoints(newPoints);
    localStorage.setItem(`points_${address}`, newPoints.toString());
    localStorage.setItem('taskCompleted', 'true');
    setIsTaskCompleted(true);

    toast.success(`Challenge completed! Earned ${todayTask.pointsReward} points`);
  }, [todayTask, userPoints, address]);

  const handleRedeem = useCallback(async (points: number): Promise<void> => {
    if (!address) return;

    // Simulate blockchain transaction
    await new Promise((resolve: (value: void) => void) => setTimeout(resolve, 3000));

    const newPoints = userPoints - points;
    setUserPoints(newPoints);
    localStorage.setItem(`points_${address}`, newPoints.toString());

    const tokenAmount = (points * 0.001).toFixed(4);
    toast.success(`Redeemed ${points} points for ${tokenAmount} $TASK!`, {
      description: 'Check your wallet for the tokens',
    });
  }, [userPoints, address]);

  const getTodayDate = (): string => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDifficultyDescription = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case DifficultyLevel.EASY:
        return 'Quick and simple challenge';
      case DifficultyLevel.MEDIUM:
        return 'Moderate skill required';
      case DifficultyLevel.HARD:
        return 'Expert level challenge';
      default:
        return 'Skill-based challenge';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="absolute inset-0 node-lines"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex justify-end mb-8">
            <WalletConnect />
          </div>
          
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full backdrop-blur-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-white uppercase tracking-wider">Base L2 Blockchain</span>
              </div>
              
              <h1 className="text-7xl md:text-8xl font-black glow-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                COIN QUEST
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl font-light">
                Complete <span className="text-cyan-400 font-semibold">interactive challenges</span>, 
                earn <span className="text-purple-400 font-semibold">points</span>, 
                redeem <span className="text-green-400 font-semibold">crypto rewards</span>
              </p>
            </div>
            
            <Card className="max-w-4xl w-full crypto-card border-purple-500/30 scan-lines">
              <CardContent className="pt-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/30 hover:border-cyan-400/50 transition-all neon-button">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-3">
                      <span className="text-2xl">🎮</span>
                    </div>
                    <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Step 01</div>
                    <h3 className="font-bold text-xl text-white">Play Games</h3>
                    <p className="text-sm text-gray-400">
                      Quizzes, puzzles, and memory challenges
                    </p>
                  </div>
                  
                  <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/30 hover:border-purple-400/50 transition-all neon-button">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="text-xs font-mono text-purple-400 uppercase tracking-widest">Step 02</div>
                    <h3 className="font-bold text-xl text-white">Earn Points</h3>
                    <p className="text-sm text-gray-400">
                      Higher difficulty = bigger rewards
                    </p>
                  </div>
                  
                  <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/30 hover:border-green-400/50 transition-all neon-button">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3">
                      <span className="text-2xl">💎</span>
                    </div>
                    <div className="text-xs font-mono text-green-400 uppercase tracking-widest">Step 03</div>
                    <h3 className="font-bold text-xl text-white">Redeem Crypto</h3>
                    <p className="text-sm text-gray-400">
                      Exchange for $TASK tokens
                    </p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-800">
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>Smart Contract Powered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                      <span>Verified on Base</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Trustless Rewards</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated backgrounds */}
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="absolute inset-0 node-lines"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5"></div>
      
      {/* Floating elements */}
      <div className="absolute top-40 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '3s' }}></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-1">
            <h1 className="text-5xl font-black glow-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              COIN QUEST
            </h1>
            <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span>LIVE ON BASE</span>
              </div>
              <span>•</span>
              <span>BLOCKCHAIN REWARDS</span>
            </div>
          </div>
          <WalletConnect />
        </div>

        {/* Date Banner */}
        <Card className="mb-8 crypto-gradient border-0 pulse-glow shimmer">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-white/60 uppercase tracking-wider mb-1.5">Current Block Time</p>
                <p className="font-bold text-white text-xl">{getTodayDate()}</p>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-white/70 font-mono">Network:</span>
                  <span className="text-white font-bold">BASE L2</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/70 font-mono">Status:</span>
                  <span className="text-green-400 font-bold">ACTIVE</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full bg-gray-900" />
            <Skeleton className="h-48 w-full bg-gray-900" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Today's Task */}
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-full mb-3 backdrop-blur-xl">
                    <span className="text-sm font-mono text-yellow-400 uppercase tracking-wider">⚡ Today's Challenge</span>
                  </div>
                  <h2 className="text-4xl font-black text-white glow-text mb-2">Interactive Task</h2>
                  {todayTask && (
                    <p className="text-gray-400 text-sm font-mono">{getDifficultyDescription(todayTask.difficulty)}</p>
                  )}
                </div>
                {todayTask && (
                  <TaskCard
                    taskType={todayTask.taskType}
                    taskTitle={todayTask.taskTitle}
                    difficulty={todayTask.difficulty}
                    pointsReward={todayTask.pointsReward}
                    isCompleted={isTaskCompleted}
                    onComplete={handleCompleteTask}
                  />
                )}
              </div>

              {/* Task Stats */}
              <Card className="crypto-card border-purple-500/30 scan-lines">
                <CardContent className="pt-8">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 neon-button">
                      <p className="text-5xl font-black text-purple-400 glow-text mb-2">
                        {isTaskCompleted ? '1' : '0'}
                      </p>
                      <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">Completed</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 neon-button">
                      <p className="text-5xl font-black glow-text-cyan text-cyan-400 mb-2">
                        {userPoints}
                      </p>
                      <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">Total Points</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 neon-button">
                      <p className="text-5xl font-black glow-text-green text-green-400 mb-2">
                        {(userPoints * 0.001).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">$TASK Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <PointsBalance points={userPoints} />
              <RedeemCard 
                availablePoints={userPoints}
                onRedeem={handleRedeem}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center space-y-3">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600 font-mono">
            <span>SKILL-BASED REWARDS</span>
            <span>•</span>
            <span>DEPLOYED ON BASE L2</span>
            <span>•</span>
            <span>INTERACTIVE CHALLENGES</span>
          </div>
          <p className="text-xs text-gray-700 font-mono">FAIR REWARD DISTRIBUTION • POWERED BY SMART CONTRACTS</p>
        </div>
      </div>
    </div>
  );
}
