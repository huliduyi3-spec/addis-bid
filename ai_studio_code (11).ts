import React from 'react';
import { X, Sparkles, AlertTriangle, ArrowRight, Trophy } from 'lucide-react';
import { UserBid, AuctionItem } from '../types/auction';
import { formatETB } from '../utils/lubEngine';

interface MyBidsModalProps {
  bids: UserBid[];
  auctions: AuctionItem[];
  onClose: () => void;
  onSelectAuction: (item: AuctionItem) => void;
  onClaimPrize: (auction: AuctionItem) => void;
}

export const MyBidsModal: React.FC<MyBidsModalProps> = ({
  bids,
  auctions,
  onClose,
  onSelectAuction,
  onClaimPrize,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative my-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-20">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>BID MANAGEMENT</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold">{bids.length} ACTIVE & PAST ENTRIES</span>
            </div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
              My Secret Bids Portfolio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {bids.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              You haven't placed any secret bids yet. Explore live auctions to place your first bid!
            </div>
          ) : (
            <div className="space-y-3">
              {bids.map((bid) => {
                const targetAuction = auctions.find((a) => a.id === bid.auctionId);
                const isItemEnded = targetAuction?.status === 'completed';
                const isWon = targetAuction?.winningBid?.userId === 'usr_me_addis' || (bid.status === 'unique_lowest' && isItemEnded);

                return (
                  <div
                    key={bid.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={bid.auctionImage}
                        alt={bid.auctionTitle}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-lg bg-slate-900 shrink-0 border border-slate-800"
                      />
                      <div>
                        <h4 className="font-semibold text-white text-xs sm:text-sm">
                          {bid.auctionTitle}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>Your Bid:</span>
                          <span className="font-mono font-bold text-amber-400 tabular-nums">
                            {formatETB(bid.amount)}
                          </span>
                          <span aria-hidden="true" className="text-slate-700">·</span>
                          <span className="text-slate-500 font-mono">
                            {new Date(bid.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div>
                        {isWon ? (
                          <span className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            Won!
                          </span>
                        ) : bid.status === 'unique_lowest' ? (
                          <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-xs flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            Unique & Lowest
                          </span>
                        ) : bid.status === 'duplicated' ? (
                          <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-medium text-xs flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            Duplicated
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs">
                            Unique (Higher)
                          </span>
                        )}
                      </div>

                      {isWon && targetAuction ? (
                        <button
                          onClick={() => {
                            onClose();
                            onClaimPrize(targetAuction);
                          }}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
                        >
                          Claim Prize
                        </button>
                      ) : targetAuction ? (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectAuction(targetAuction);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Auction Lot"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};