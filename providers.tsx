'use client';

import type { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

const config = createConfig({
  chains: [base],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: 'CoinQuest' }),
    walletConnect({ projectId: '1d0226d4-9f84-48d6-9486-b4381e220d9f' }),
  ],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
