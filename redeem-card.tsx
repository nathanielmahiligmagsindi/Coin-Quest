'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface RedeemCardProps {
  availablePoints: number;
  onRedeem: (points: number) => Promise<void>;
}

export function RedeemCard({ availablePoints, onRedeem }: RedeemCardProps) {
  const [pointsToRedeem, setPointsToRedeem] = useState<string>('');
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);

  const handleRedeem = async (): Promise<void> => {
    const points = Number.parseInt(pointsToRedeem, 10);
    
    if (points <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (points > availablePoints) {
      toast.error('Insufficient points');
      return;
    }

    setIsRedeeming(true);
    try {
      await onRedeem(points);
      setPointsToRedeem('');
      toast.success('Points redeemed successfully!');
    } catch (error: unknown) {
      toast.error('Failed to redeem points');
      console.error('Redemption error:', error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const estimatedValue = (Number.parseInt(pointsToRedeem, 10) || 0) * 0.001;

  return (
    <Card className="crypto-card border-green-500/30 scan-lines neon-button">
      <CardHeader>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-3 w-fit">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">💎 Redeem</span>
        </div>
        <CardTitle className="text-white font-black text-2xl glow-text-green">
          Claim Crypto
        </CardTitle>
        <CardDescription className="text-gray-400 font-mono text-xs uppercase tracking-wider">
          Exchange points for $TASK tokens on Base
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="points" className="text-gray-300 font-mono text-xs uppercase tracking-wider">Points to Redeem</Label>
          <Input
            id="points"
            type="number"
            placeholder="Enter amount"
            value={pointsToRedeem}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPointsToRedeem(e.target.value)}
            max={availablePoints}
            min={0}
            className="bg-gray-900 border-gray-700 text-white font-mono text-lg py-6 focus:border-green-500/50 focus:ring-green-500/20 backdrop-blur-xl"
          />
          <p className="text-xs text-gray-500 font-mono">
            Available: <span className="text-green-400 font-bold">{availablePoints.toLocaleString()}</span> points
          </p>
        </div>

        {pointsToRedeem && Number.parseInt(pointsToRedeem, 10) > 0 && (
          <div className="p-5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-2xl shimmer backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono text-gray-300 uppercase tracking-wider">You Receive:</span>
              <span className="font-black text-2xl text-green-400 font-mono glow-text-green">
                {estimatedValue.toFixed(4)} $TASK
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
              Rate: 1000 PTS = 1 $TASK
            </p>
          </div>
        )}

        <Button 
          onClick={handleRedeem}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-mono font-bold uppercase tracking-widest py-6 text-base neon-button"
          disabled={!pointsToRedeem || isRedeeming || availablePoints === 0}
        >
          {isRedeeming ? '⏳ PROCESSING...' : '→ REDEEM NOW'}
        </Button>

        <div className="pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-600 font-mono text-center uppercase tracking-wider">
            Smart Contract Redemption • Gas Fees Apply
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
