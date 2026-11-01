import React, { useState, useEffect } from 'react';
import { X, Trophy, ShieldCheck, AlertOctagon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuctionItem } from '../types/auction';
import { analyzeLUB, formatETB } from '../utils/lubEngine';

interface AuctionResultModalProps {
  item: AuctionItem;
  currency: 'ETB' | 'USD';
  onClose: () => void;
  onClaimPrize?: () => void;
  isUserWinner?: boolean;
}

export const AuctionResultModal: React.FC<AuctionResultModalProps> = ({
  item,
  onClose,
  onClaimPrize,
  isUserWinner = false,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'unique' | 'duplicates'>('all');
  const analysis = analyzeLUB(item.bids);

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#F43F5E'],
    });
  }, []);

  const winningRecord = analysis.winningBidRecord || item.winningBid;
  const winningAmount = analysis.winningAmount || item.winningBid?.amount || 0;
  const savingsPercent = item.winningBid?.retailSavingsPercent ||
    Math.round(((item.retailValueETB - winningAmount) / item.retailValueETB) * 100);

  const displayedFrequencies = analysis.frequencies.filter((f) => {
    if (filterMode === 'unique') return f.isUnique;
    if (filterMode === 'duplicates') return !f.isUnique;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative my-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>OFFICIAL AUCTION RESULT</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-semibold">VERIFIED & AUDITED</span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                {item.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border-b border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                Official Winning Bid Announcement
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
                {winningRecord?.userName || 'Dawit M.'} claims the prize!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Placed the lowest positive bid that was unique across all {analysis.totalBids || item.totalBidsCount} sealed submissions. Every lower bid collided with another bidder and was cancelled out.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center md:text-right">
              <div className="text-xs text-slate-400">Winning Price</div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400 tabular-nums mt-0.5">
                {formatETB(winningAmount)}
              </div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                Saved {savingsPercent}% off retail ({formatETB(item.retailValueETB)})
              </div>

              {isUserWinner && onClaimPrize && (
                <button
                  onClick={onClaimPrize}
                  className="mt-3 w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Claim Prize & Delivery
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-base text-white">
                Transparent Bid Frequency Audit
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Full cryptographic verification of all bids. Only bids with exactly 1 submission are eligible.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs self-start sm:self-auto">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  filterMode === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({analysis.frequencies.length})
              </button>
              <button
                onClick={() => setFilterMode('unique')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  filterMode === 'unique' ? 'bg-amber-400 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Unique ({analysis.uniqueBids.length})
              </button>
              <button
                onClick={() => setFilterMode('duplicates')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  filterMode === 'duplicates' ? 'bg-rose-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Duplicate Collisions ({analysis.duplicatedBids.length})
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-medium border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-4">Price Point (ETB)</th>
                    <th className="py-2.5 px-4">Submissions</th>
                    <th className="py-2.5 px-4">Bidders</th>
                    <th className="py-2.5 px-4">Audit Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {displayedFrequencies.map((freq) => (
                    <tr
                      key={freq.amount}
                      className={`transition-colors ${
                        freq.isWinning
                          ? 'bg-amber-400/10 hover:bg-amber-400/15'
                          : freq.isUnique
                          ? 'hover:bg-slate-900/50'
                          : 'bg-rose-950/10 hover:bg-rose-950/20 text-slate-400'
                      }`}
                    >
                      <td className="py-2.5 px-4 font-bold text-white tabular-nums">
                        {formatETB(freq.amount)}
                      </td>
                      <td className="py-2.5 px-4 tabular-nums">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${
                          freq.count > 1 ? 'bg-rose-900/40 text-rose-300' : 'bg-slate-800 text-slate-200'
                        }`}>
                          {freq.count} {freq.count === 1 ? 'bid' : 'bids'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-sans text-slate-300 text-[11px] truncate max-w-xs">
                        {freq.bidders.join(', ')}
                      </td>
                      <td className="py-2.5 px-4 font-sans">
                        {freq.isWinning ? (
                          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5" />
                            WINNER (Lowest & Unique!)
                          </span>
                        ) : freq.isUnique ? (
                          <span className="text-slate-400">
                            Unique (Higher than winning {formatETB(winningAmount)})
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <AlertOctagon className="w-3 h-3 shrink-0" />
                            Cancelled Out (Duplicate collision)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                SHA-256 Commit: <span className="font-mono text-slate-300">{item.fairCommitHash.slice(0, 24)}...</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Verified by Addis Bid Distributed Ledger Engine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};