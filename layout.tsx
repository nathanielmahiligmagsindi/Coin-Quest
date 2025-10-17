import type { Metadata } from 'next'
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import FarcasterWrapper from "@/components/FarcasterWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en">
          <body>
            <Providers>
              
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      
              <Toaster />
            </Providers>
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "Coin Quest - Crypto Task Reward dApp",
        description: "Complete daily tasks on Base L2 blockchain for crypto rewards. Track progress, earn points, and redeem points for cryptocurrency with wallet connection and smart contract integration.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_9906419e-ba40-4d8d-b5a7-6a9614f2014b-4IzktHqC2a4B37j7YKmlf9tAhaaTaU","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"Coin Quest","url":"https://depend-camp-749.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
