'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-white font-mono backdrop-blur-xl neon-button">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            {address.slice(0, 6)}...{address.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="crypto-card border-purple-500/30 backdrop-blur-xl">
          <DropdownMenuItem onClick={() => disconnect()} className="text-white font-mono cursor-pointer hover:bg-purple-500/20">
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 font-mono font-bold uppercase tracking-widest neon-button backdrop-blur-xl">
          Connect Wallet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="crypto-card border-purple-500/30 backdrop-blur-xl">
        {connectors.map((connector) => (
          <DropdownMenuItem
            key={connector.id}
            onClick={() => connect({ connector })}
            className="text-white font-mono cursor-pointer hover:bg-purple-500/20"
          >
            {connector.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
