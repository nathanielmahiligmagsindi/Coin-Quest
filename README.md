# 🎮 Coin Quest - Interactive Crypto Reward dApp

**Coin Quest** is a decentralized application (dApp) built on the **Base L2 blockchain** where users complete interactive challenges to earn points and redeem them for cryptocurrency rewards.

![Base L2](https://img.shields.io/badge/Base-L2-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Wagmi](https://img.shields.io/badge/Wagmi-2.x-purple)

---

## 🌟 Features

### 🎯 Interactive Challenges
- **Crypto Quiz**: Test your blockchain knowledge (Easy/Medium/Hard)
- **Memory Match**: Match crypto symbols under time pressure
- **Pattern Recognition**: Memorize and recreate blockchain patterns
- **Word Puzzle**: Unscramble crypto-related words

### 💰 Difficulty-Based Rewards
- **Easy Tasks**: 10 points
- **Medium Tasks**: 25 points
- **Hard Tasks**: 50 points

### 🔗 Web3 Integration
- Wallet connection via **MetaMask**, **Coinbase Wallet**, and **WalletConnect**
- Built on **Base L2** blockchain for low fees and fast transactions
- Smart contract integration for point redemption
- $TASK token rewards (ERC-20)

### 🎨 Modern UI/UX
- Dark crypto-themed design with neon gradients
- Responsive layout for desktop and mobile
- Real-time progress tracking
- Toast notifications for user feedback

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Blockchain**: [Base L2](https://base.org/) (Ethereum Layer 2)
- **Web3 Libraries**: 
  - [wagmi](https://wagmi.sh/) - React hooks for Ethereum
  - [viem](https://viem.sh/) - TypeScript interface for Ethereum
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with shadcn/ui
- **State Management**: React hooks + localStorage

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- A **Web3 wallet** (MetaMask, Coinbase Wallet, or WalletConnect compatible)
- **Base network** configured in your wallet

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/coinquest-dapp.git
cd coinquest-dapp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup (Optional)

The app works out of the box without any environment variables. However, if you want to enable WalletConnect support, you can add:

Create a `.env.local` file in the root directory:

```env
# Optional: WalletConnect Project ID
# Get your free Project ID at: https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# The app works without this using MetaMask and Coinbase Wallet
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🌐 Deployment

### ⚠️ IMPORTANT: Deployment Configuration

The project is **pre-configured** to deploy successfully to Vercel with automatic lockfile handling via the included `vercel.json` file. No manual intervention needed!

### ✅ Deployment Guarantee

This project has been **tested and verified** to build successfully:
- ✅ Build passes with exit code 0
- ✅ All TypeScript errors resolved
- ✅ Webpack configured to handle Web3 libraries
- ✅ Automatic dependency resolution
- ✅ Optimized for Vercel deployment
- ✅ Next.js 15 fully configured

**Expected build warnings (safe to ignore):**
- `@react-native-async-storage/async-storage` - Optional MetaMask SDK dependency
- `pino-pretty` - Optional WalletConnect logger
- `indexedDB is not defined` - Normal during static generation (only available in browser)

These warnings **do not affect functionality** and are expected behavior.

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/coinquest-dapp)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variable (Optional)**:
   
   For WalletConnect support, you can add your WalletConnect Project ID:
   
   - Before deploying, click "Environment Variables"
   - Add the following:
     - **Key**: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
     - **Value**: Your WalletConnect Project ID (get one free at [cloud.walletconnect.com](https://cloud.walletconnect.com))
   - Or skip this step - the app works without it using MetaMask and Coinbase Wallet
   
   Click "Deploy"

4. **Configure Settings** (if needed):
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Node.js Version: 18.x or higher

### 🚨 Troubleshooting Vercel Deployment

If you encounter the error: **"Couldn't find any `pages` or `app` directory"**

**✅ Solution (Files Already Included):**
The following configuration files have been added to fix this issue:
- ✅ `next.config.mjs` - Next.js configuration
- ✅ `vercel.json` - Vercel build settings

**If the error persists:**

1. **Verify in Vercel Dashboard**:
   - Go to: Project Settings → General → Build & Development Settings
   - Ensure these values:
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`
     - **Root Directory**: `./` (leave empty or set to root)

2. **Manual Configuration**:
   If Vercel doesn't auto-detect the framework:
   - Override Framework Preset to "Next.js"
   - Save and redeploy

3. **Check Repository Structure**:
   Ensure your GitHub repo has these files in the root:
   ```
   ├── next.config.mjs  ✅
   ├── vercel.json      ✅
   ├── package.json     ✅
   ├── tsconfig.json    ✅
   └── src/
       └── app/         ✅
   ```

4. **Redeploy**:
   - After configuration changes, trigger a new deployment
   - Go to Deployments tab → Click "..." → Redeploy

### Deploy to Other Platforms

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### Self-Hosted
```bash
npm run build
npm start
```

---

## 🎮 How to Use

### 1. Connect Your Wallet
- Click the "CONNECT WALLET" button in the top right
- Choose your preferred wallet (MetaMask, Coinbase Wallet, or WalletConnect)
- Approve the connection request
- Ensure you're connected to the **Base network**

### 2. Complete Daily Challenges
- Each day features a unique interactive challenge
- Click "START TASK" to begin the game
- Complete the challenge successfully to earn points:
  - **Easy**: 10 points
  - **Medium**: 25 points
  - **Hard**: 50 points

### 3. Redeem Rewards
- View your accumulated points in the sidebar
- Click "REDEEM POINTS" when you have enough
- Enter the amount of points to exchange
- Confirm the smart contract transaction
- Receive $TASK tokens in your wallet

---

## 🎯 Game Instructions

### Crypto Quiz
- Answer 3-5 multiple choice questions
- Topics include blockchain, DeFi, and Web3
- Pass requirement: 67-80% correct (depending on difficulty)

### Memory Match
- Match 8 pairs of crypto symbols
- Remember positions and find matching pairs
- Complete within 60 seconds
- All pairs must be matched to win

### Pattern Recognition
- Watch cells light up ONE BY ONE in sequence
- Memorize the order (4-8 cells depending on round)
- Click cells in the same sequence
- Complete 3/5 rounds correctly to win

### Word Puzzle
- Unscramble 5 crypto-related words
- Use hints if needed (3 hints available)
- Complete 3/5 puzzles correctly
- 90 second time limit

---

## 🔧 Project Structure

```
coin-quest-dapp/
├── src/
│   ├── app/
│   │   ├── api/              # API routes (proxy, health, logger)
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx        # Root layout with metadata
│   │   ├── providers.tsx     # Web3 providers (Wagmi, QueryClient)
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── games/            # Game components
│   │   │   ├── QuizGame.tsx
│   │   │   ├── MemoryGame.tsx
│   │   │   ├── PatternGame.tsx
│   │   │   └── WordPuzzle.tsx
│   │   ├── ui/               # UI components (shadcn/ui)
│   │   ├── task-card.tsx     # Task card component
│   │   ├── points-balance.tsx
│   │   ├── redeem-card.tsx
│   │   └── wallet-connect.tsx
│   └── lib/
│       ├── contracts.ts      # Smart contract ABIs and config
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

---

## 🔐 Smart Contracts

### Task Manager Contract
Handles task verification and point tracking on the Base L2 blockchain.

**Functions:**
- `completeTask(uint256 taskId)` - Verify and record task completion
- `getUserPoints(address user)` - Get user's current point balance
- `redeemPoints(uint256 points)` - Exchange points for $TASK tokens

### $TASK Token Contract (ERC-20)
The reward token users earn by completing challenges.

**Token Details:**
- Name: Task Token
- Symbol: $TASK
- Decimals: 18
- Network: Base L2
- Exchange Rate: 1000 points = 1 $TASK

---

## 🌍 Base Network Configuration

Add Base network to your wallet:

**Base Mainnet**
- Network Name: Base
- RPC URL: https://mainnet.base.org
- Chain ID: 8453
- Currency Symbol: ETH
- Block Explorer: https://basescan.org

**Base Sepolia (Testnet)**
- Network Name: Base Sepolia
- RPC URL: https://sepolia.base.org
- Chain ID: 84532
- Currency Symbol: ETH
- Block Explorer: https://sepolia.basescan.org

---

## 🧪 Testing

### Run Tests
```bash
npm test
# or
yarn test
```

### Build for Production
```bash
npm run build
# or
yarn build
```

### Check Build Output
```bash
npm start
# or
yarn start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Base L2](https://base.org/)
- Web3 integration via [wagmi](https://wagmi.sh/) and [viem](https://viem.sh/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## 📧 Support

For questions or issues:
- Open an issue on [GitHub](https://github.com/yourusername/coinquest-dapp/issues)
- Contact: your-email@example.com

---

## 🎉 Features Coming Soon

- [ ] Leaderboard system
- [ ] Multiplayer challenges
- [ ] NFT reward badges
- [ ] More game types
- [ ] Mobile app
- [ ] Social sharing features

---

**Built with ❤️ on Base L2 blockchain**
