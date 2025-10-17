'use client';

// Task Types - now representing different game/quiz types
export enum TaskType {
  QUIZ = 0,
  MEMORY = 1,
  PATTERN = 2,
  WORD = 3,
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  [TaskType.QUIZ]: 'CRYPTO QUIZ',
  [TaskType.MEMORY]: 'MEMORY MATCH',
  [TaskType.PATTERN]: 'PATTERN GAME',
  [TaskType.WORD]: 'WORD PUZZLE',
};

// Difficulty levels with corresponding point rewards
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export const DIFFICULTY_POINTS: Record<DifficultyLevel, number> = {
  [DifficultyLevel.EASY]: 10,
  [DifficultyLevel.MEDIUM]: 25,
  [DifficultyLevel.HARD]: 50,
};

// Mock ERC-20 Token Contract ABI
export const TASK_TOKEN_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Task Manager Contract ABI
export const TASK_MANAGER_ABI = [
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'taskId', type: 'uint256' },
    ],
    name: 'completeTask',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserPoints',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'points', type: 'uint256' },
    ],
    name: 'redeemPoints',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
