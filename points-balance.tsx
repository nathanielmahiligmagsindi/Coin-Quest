'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PointsBalanceProps {
  points: number;
}

export function PointsBalance({ points }: PointsBalanceProps) {
  return (
    <Card className="crypto-card border-purple-500/30 pulse-glow scan-lines">
      <CardHeader className="pb-4">
        <CardDescription className="text-gray-400 font-mono text-xs uppercase tracking-wider">Your Balance</CardDescription>
        <CardTitle className="text-6xl font-black flex items-center gap-2 text-white glow-text">
          {points.toLocaleString()}
        </CardTitle>
        <p className="text-sm font-mono font-bold text-yellow-400 uppercase tracking-widest">POINTS</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        <p className="text-xs text-gray-400 font-mono leading-relaxed">
          Complete daily tasks to earn more points and redeem crypto rewards on-chain
        </p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 backdrop-blur-xl neon-button">
            <p className="text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">Earned Today</p>
            <p className="text-2xl font-black text-white">{points > 0 ? '✓' : '—'}</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 backdrop-blur-xl neon-button">
            <p className="text-xs text-green-400 font-mono uppercase tracking-wider mb-1">$TASK Value</p>
            <p className="text-2xl font-black text-white">{(points * 0.001).toFixed(3)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
