import React, { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { AuctionCard } from './components/AuctionCard';
import { AuctionDetailModal } from './components/AuctionDetailModal';
import { AuctionResultModal } from './components/AuctionResultModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { StrategySandbox } from './components/StrategySandbox';
import { WalletModal } from './components/WalletModal';
import { MyBidsModal } from './components/MyBidsModal';
import { ClaimPrizeModal } from './components/ClaimPrizeModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { MOCK_AUCTIONS, INITIAL_USER } from './data/mockAuctions';
import { AuctionItem, UserProfile, UserBid, WalletTransaction, AppNotification, AuctionCategory, PaymentMethod } from './types/auction';
import { formatETB, formatUSD, getBidStatus, SAMPLE_BIDDER_NAMES } from './utils/lubEngine';

export default function App() {
  const [auctions, setAuctions] = useState<AuctionItem[]>(MOCK_AUCTIONS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [currency, setCurrency] = useState<'ETB' | 'USD'>('ETB');

  const [userBids, setUserBids] = useState<UserBid[]>([
    {
      id: 'ub-1',
      auctionId: 'auc-suv-byd',
      auctionTitle: 'BYD Song Plus EV Luxury Edition',
      auctionImage: '/src/assets/images/item_toyota_suv_1793560375507.jpg',
      amount: 3.84,
      feePaidETB: 75,
      placedAt: Date.now() - 15 * 60 * 1000,
      status: 'unique_lowest',
    },
    {
      id: 'ub-2',
      auctionId: 'auc-iphone-16-pro',
      auctionTitle: 'Apple iPhone 16 Pro Max 1TB',
      auctionImage: '/src/assets/images/item_iphone_pro_1793560376932.jpg',
      amount: 1.25,
      feePaidETB: 30,
      placedAt: Date.now() - 32 * 60 * 1000,
      status: 'duplicated',
    },
  ]);

  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-1',
      type: 'deposit',
      method: 'telebirr',
      amountETB: 3500,
      description: 'telebirr Mobile Money Instant Deposit',
      timestamp: Date.now() - 86400000,
      referenceId: 'TLB-893120-ET',
      status: 'completed',
    },
    {
      id: 'tx-2',
      type: 'bid_fee',
      amountETB: 75,
      description: 'Secret Bid Entry Fee (BYD Song Plus EV)',
      timestamp: Date.now() - 15 * 60 * 1000,
      referenceId: 'FEE-001924',
      status: 'completed',
    },
    {
      id: 'tx-3',
      type: 'bid_fee',
      amountETB: 30,
      description: 'Secret Bid Entry Fee (iPhone 16 Pro Max)',
      timestamp: Date.now() - 32 * 60 * 1000,
      referenceId: 'FEE-001925',
      status: 'completed',
    },
  ]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: '🌟 Leading Position!',
      message: 'Your bid of 3.84 ETB on BYD Song Plus EV is currently the Lowest Unique Bid!',
      timestamp: Date.now() - 12 * 60 * 1000,
      read: false,
      type: 'unique_alert',
      auctionId: 'auc-suv-byd',
    },
    {
      id: 'notif-2',
      title: '⚠️ Duplicate Collision Alert',
      message: 'Another participant placed 1.25 ETB on iPhone 16 Pro Max. Your bid was cancelled out!',
      timestamp: Date.now() - 28 * 60 * 1000,
      read: false,
      type: 'duplicate_alert',
      auctionId: 'auc-iphone-16-pro',
    },
    {
      id: 'notif-3',
      title: 'Welcome to Addis Bid',
      message: 'Enjoy 3,500 ETB in starting balance to explore lowest unique bidding!',
      timestamp: Date.now() - 86400000,
      read: true,
      type: 'system',
    },
  ]);

  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [auditAuction, setAuditAuction] = useState<AuctionItem | null>(null);
  const [claimAuction, setClaimAuction] = useState<AuctionItem | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [isMyBidsOpen, setIsMyBidsOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  const [categoryFilter, setCategoryFilter] = useState<AuctionCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'ending_soon' | 'value_high' | 'bids_high'>('ending_soon');
  const [activeNavTab, setActiveNavTab] = useState<string>('auctions');

  useEffect(() => {
    const interval = setInterval(() => {
      const liveAuctions = auctions.filter((a) => a.status !== 'completed');
      if (liveAuctions.length === 0) return;

      const target = liveAuctions[Math.floor(Math.random() * liveAuctions.length)];
      const randomBidder = SAMPLE_BIDDER_NAMES[Math.floor(Math.random() * SAMPLE_BIDDER_NAMES.length)];
      
      const userBidsOnTarget = userBids.filter((b) => b.auctionId === target.id);
      let compAmount: number;

      if (userBidsOnTarget.length > 0 && Math.random() < 0.15) {
        compAmount = userBidsOnTarget[0].amount;
      } else {
        compAmount = Number((Math.random() * 35 + 0.1).toFixed(2));
      }

      const newBid = {
        id: `bid-sim-${Date.now()}`,
        userId: `usr-sim-${Date.now()}`,
        userName: randomBidder,
        amount: compAmount,
        timestamp: Date.now(),
      };

      setAuctions((prev) =>
        prev.map((auc) => {
          if (auc.id !== target.id) return auc;
          const updatedBids = [...auc.bids, newBid];
          return {
            ...auc,
            bids: updatedBids,
            totalBidsCount: updatedBids.length,
          };
        })
      );

      setUserBids((prev) =>
        prev.map((ub) => {
          if (ub.auctionId !== target.id) return ub;
          const updatedTargetBids = [...target.bids, newBid];
          const newStatus = getBidStatus(ub.amount, updatedTargetBids);

          if (ub.status !== 'duplicated' && newStatus === 'duplicated') {
            const alertNotif: AppNotification = {
              id: `notif-${Date.now()}`,
              title: '⚠️ Bid Collision Detected!',
              message: `${randomBidder} placed ${formatETB(compAmount)} on ${target.title}. Your bid is now cancelled out!`,
              timestamp: Date.now(),
              read: false,
              type: 'duplicate_alert',
              auctionId: target.id,
            };
            setNotifications((n) => [alertNotif, ...n]);
          }

          return { ...ub, status: newStatus };
        })
      );
    }, 18000);

    return () => clearInterval(interval);
  }, [auctions, userBids]);

  const handlePlaceBid = (auctionId: string, amount: number): boolean => {
    const target = auctions.find((a) => a.id === auctionId);
    if (!target) return false;

    if (user.walletBalanceETB < target.entryFeeETB) {
      setIsWalletOpen(true);
      return false;
    }

    const newBidRecord = {
      id: `bid-usr-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      amount,
      timestamp: Date.now(),
      isUser: true,
    };

    const updatedBids = [...target.bids, newBidRecord];
    const status = getBidStatus(amount, updatedBids);

    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auctionId
          ? { ...a, bids: updatedBids, totalBidsCount: updatedBids.length }
          : a
      )
    );

    setUser((prev) => ({
      ...prev,
      walletBalanceETB: prev.walletBalanceETB - target.entryFeeETB,
      totalBidsPlaced: prev.totalBidsPlaced + 1,
    }));

    const newBid: UserBid = {
      id: `ub-${Date.now()}`,
      auctionId,
      auctionTitle: target.title,
      auctionImage: target.image,
      amount,
      feePaidETB: target.entryFeeETB,
      placedAt: Date.now(),
      status,
    };
    setUserBids((prev) => [newBid, ...prev]);

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'bid_fee',
      amountETB: target.entryFeeETB,
      description: `Secret Bid Entry (${target.title})`,
      timestamp: Date.now(),
      referenceId: `FEE-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (status === 'unique_lowest') {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: '🌟 Leading Position!',
        message: `Your bid of ${formatETB(amount)} is currently the lowest unique bid on ${target.title}!`,
        timestamp: Date.now(),
        read: false,
        type: 'unique_alert',
        auctionId,
      };
      setNotifications((n) => [notif, ...n]);
    } else if (status === 'duplicated') {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: '⚠️ Duplicate Collision Alert',
        message: `Your bid of ${formatETB(amount)} was already placed by another bidder. It is currently cancelled out.`,
        timestamp: Date.now(),
        read: false,
        type: 'duplicate_alert',
        auctionId,
      };
      setNotifications((n) => [notif, ...n]);
    }

    return true;
  };

  const handlePlaceSpreadBids = (auctionId: string, amounts: number[]) => {
    amounts.forEach((amt) => {
      handlePlaceBid(auctionId, amt);
    });
  };

  const handleDeposit = (amount: number, method: PaymentMethod) => {
    setUser((prev) => ({
      ...prev,
      walletBalanceETB: prev.walletBalanceETB + amount,
    }));

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      method,
      amountETB: amount,
      description: `${method.toUpperCase()} Mobile Deposit`,
      timestamp: Date.now(),
      referenceId: `${method.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-ET`,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Deposit Successful',
      message: `Credited ${formatETB(amount)} to your Addis Bid balance.`,
      timestamp: Date.now(),
      read: false,
      type: 'deposit',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const filteredAuctions = auctions.filter((auc) => {
    const matchesCategory = categoryFilter === 'all' || auc.category === categoryFilter;
    const matchesSearch =
      auc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    if (sortBy === 'ending_soon') {
      if (a.status === 'completed') return 1;
      if (b.status === 'completed') return -1;
      return a.endTime - b.endTime;
    }
    if (sortBy === 'value_high') {
      return b.retailValueETB - a.retailValueETB;
    }
    if (sortBy === 'bids_high') {
      return b.totalBidsCount - a.totalBidsCount;
    }
    return 0;
  });

  const featuredItem = auctions[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      <Navbar
        user={user}
        currency={currency}
        onToggleCurrency={() => setCurrency((c) => (c === 'ETB' ? 'USD' : 'ETB'))}
        notifications={notifications}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenMyBids={() => setIsMyBidsOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        onOpenWinners={() => {
          const completedLot = auctions.find((a) => a.status === 'completed') || auctions[0];
          setAuditAuction(completedLot);
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
      />

      <HeroBanner
        featuredItem={featuredItem}
        currency={currency}
        onSelectAuction={(item) => setSelectedAuction(item)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      <main id="auctions-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <span>EXPLORE LOTS</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">SECRET REVERSE AUCTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Active Auction Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Browse brand-new electronics, vehicles, and lifestyle goods available for secret lowest unique bidding.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
            {(['all', 'vehicles', 'smartphones', 'laptops', 'gaming'] as AuctionCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors capitalize ${
                  categoryFilter === cat
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Lots' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, vehicle, or electronics..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-3 text-xs self-end sm:self-auto">
            <span className="text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-amber-400"
            >
              <option value="ending_soon">Ending Soon</option>
              <option value="value_high">Highest Retail Value</option>
              <option value="bids_high">Most Active Bids</option>
            </select>
          </div>
        </div>

        {sortedAuctions.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No auction lots found matching your filter criteria. Try clearing search or selecting "All Lots".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedAuctions.map((item) => (
              <AuctionCard
                key={item.id}
                item={item}
                currency={currency}
                userBidsOnItem={userBids.filter((b) => b.auctionId === item.id)}
                onSelect={(selected) => setSelectedAuction(selected)}
                onOpenAudit={(completed) => setAuditAuction(completed)}
              />
            ))}
          </div>
        )}

        <section className="mt-20 pt-12 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <span>VERIFIABLE RESULTS</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">TRANSPARENT WINNERS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                Recent Addis Bid Champions
              </h3>
            </div>
            <button
              onClick={() => {
                const completedLot = auctions.find((a) => a.status === 'completed') || auctions[0];
                setAuditAuction(completedLot);
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full Cryptographic Audit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">DJI Mini 4 Pro Drone Kit</span>
                <span className="font-mono text-emerald-400 font-bold text-xs">99.98% Saved</span>
              </div>
              <div className="text-lg font-display font-bold text-white">
                Won for <span className="font-mono text-amber-400">4.17 ETB</span>
              </div>
              <div className="text-xs text-slate-400">
                Champion: <strong className="text-white">Dawit M.</strong> (Bole, Addis Ababa)
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                SHA-256 Commit: sha256-91b72e...
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Samsung S24 Ultra 512GB</span>
                <span className="font-mono text-emerald-400 font-bold text-xs">99.94% Saved</span>
              </div>
              <div className="text-lg font-display font-bold text-white">
                Won for <span className="font-mono text-amber-400">8.92 ETB</span>
              </div>
              <div className="text-xs text-slate-400">
                Champion: <strong className="text-white">Bethlehem A.</strong> (Kazanchis)
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                SHA-256 Commit: sha256-4c810d...
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Sony Alpha 7 IV Camera</span>
                <span className="font-mono text-emerald-400 font-bold text-xs">99.96% Saved</span>
              </div>
              <div className="text-lg font-display font-bold text-white">
                Won for <span className="font-mono text-amber-400">6.35 ETB</span>
              </div>
              <div className="text-xs text-slate-400">
                Champion: <strong className="text-white">Yonas T.</strong> (Sarbet)
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                SHA-256 Commit: sha256-a19e44...
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <span className="font-display font-extrabold text-lg text-white">
                ADDIS<span className="text-amber-400">BID</span>
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Addis Ababa’s premier lowest unique price reverse auction platform. All products are authentic with official manufacturer warranties and transparent cryptographic auditing.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase text-slate-300 tracking-wider mb-3">
                Platform Rules
              </h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => setIsHowItWorksOpen(true)} className="hover:text-white transition-colors">
                    Lowest Unique Bid Rules
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsSandboxOpen(true)} className="hover:text-white transition-colors">
                    Game Theory Simulator
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsWalletOpen(true)} className="hover:text-white transition-colors">
                    telebirr & CBE Birr Deposits
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase text-slate-300 tracking-wider mb-3">
                Security & Compliance
              </h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>Deterministic SHA-256 Hashes</li>
                <li>Fair-Play Verification Ledger</li>
                <li>Authorized Ethiopian Distributor Partners</li>
                <li>Bole Medhanialem Logistics Centre</li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase text-slate-300 tracking-wider mb-3">
                Payment Partners
              </h5>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">telebirr</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">CBE Birr</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Chapa</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Visa / MC</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>© {new Date().getFullYear()} Addis Bid Technologies PLC. All rights reserved. Addis Ababa, Ethiopia.</div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span aria-hidden="true">·</span>
              <span>Terms of Participation</span>
              <span aria-hidden="true">·</span>
              <span>Fairness Pledge</span>
            </div>
          </div>
        </div>
      </footer>

      {selectedAuction && (
        <AuctionDetailModal
          item={selectedAuction}
          user={user}
          currency={currency}
          userBidsOnItem={userBids.filter((b) => b.auctionId === selectedAuction.id)}
          onClose={() => setSelectedAuction(null)}
          onPlaceBid={handlePlaceBid}
          onPlaceSpreadBids={handlePlaceSpreadBids}
          onOpenWallet={() => {
            setSelectedAuction(null);
            setIsWalletOpen(true);
          }}
        />
      )}

      {auditAuction && (
        <AuctionResultModal
          item={auditAuction}
          currency={currency}
          onClose={() => setAuditAuction(null)}
          onClaimPrize={() => {
            setClaimAuction(auditAuction);
            setAuditAuction(null);
          }}
          isUserWinner={auditAuction.winningBid?.userId === user.id}
        />
      )}

      {claimAuction && (
        <ClaimPrizeModal
          item={claimAuction}
          user={user}
          winningAmount={claimAuction.winningBid?.amount || 4.17}
          onClose={() => setClaimAuction(null)}
          onSuccess={() => {
            setUser((prev) => ({ ...prev, winsCount: prev.winsCount + 1 }));
          }}
        />
      )}

      {isHowItWorksOpen && (
        <HowItWorksModal
          onClose={() => setIsHowItWorksOpen(false)}
          onOpenSandbox={() => setIsSandboxOpen(true)}
        />
      )}

      {isSandboxOpen && (
        <StrategySandbox onClose={() => setIsSandboxOpen(false)} />
      )}

      {isWalletOpen && (
        <WalletModal
          user={user}
          currency={currency}
          transactions={transactions}
          onClose={() => setIsWalletOpen(false)}
          onDeposit={handleDeposit}
        />
      )}

      {isMyBidsOpen && (
        <MyBidsModal
          bids={userBids}
          auctions={auctions}
          onClose={() => setIsMyBidsOpen(false)}
          onSelectAuction={(lot) => {
            setIsMyBidsOpen(false);
            setSelectedAuction(lot);
          }}
          onClaimPrize={(lot) => {
            setIsMyBidsOpen(false);
            setClaimAuction(lot);
          }}
        />
      )}

      {isNotificationsOpen && (
        <NotificationsPopover
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllAsRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          }}
          onNotificationClick={(notif) => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
            );
            if (notif.auctionId) {
              const target = auctions.find((a) => a.id === notif.auctionId);
              if (target) {
                setIsNotificationsOpen(false);
                if (target.status === 'completed') {
                  setAuditAuction(target);
                } else {
                  setSelectedAuction(target);
                }
              }
            }
          }}
        />
      )}
    </div>
  );
}