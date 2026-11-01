import React from 'react';
import { X, HelpCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  onOpenSandbox: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose, onOpenSandbox }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative my-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>OFFICIAL PLATFORM GUIDE</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-semibold">RULES & STRATEGY</span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                How Addis Bid Works
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

        <div className="p-4 sm:p-6 space-y-6 text-xs sm:text-sm text-slate-300">
          <div>
            <h3 className="font-display font-bold text-base text-white mb-2">
              The Reverse Auction Twist
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Unlike traditional auctions where the highest bidder with the deepest pockets wins, Addis Bid turns the tables in favor of smart, strategic thinkers. The winner is the participant who places the <strong className="text-amber-300">lowest price that no one else submitted</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <div>
                <h4 className="font-semibold text-white">Your Bid Is Secret & Sealed</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  All submitted prices are encrypted and hidden from other bidders throughout the auction duration to preserve suspense and guarantee complete fairness.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <div>
                <h4 className="font-semibold text-white">Duplicate Bids Cancel Out</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  If two or more bidders place the exact same price (for example, two people bidding 0.05 ETB), that price point is disqualified and cancelled out!
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <div>
                <h4 className="font-semibold text-white">The Lowest Unique Price Claims The Lot</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  When the auction timer reaches zero, the algorithm sorts all remaining non-duplicated bids. The lowest unique bid wins the lot at that exact price!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>Real Example in Action:</span>
            </h4>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between p-1.5 rounded bg-rose-950/20 text-rose-300">
                <span>0.01 ETB (4 bidders chose this)</span>
                <span className="line-through">Cancelled (Duplicate)</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-rose-950/20 text-rose-300">
                <span>0.05 ETB (2 bidders chose this)</span>
                <span className="line-through">Cancelled (Duplicate)</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-emerald-950/30 text-emerald-300 font-bold border border-emerald-800/40">
                <span>0.18 ETB (Only 1 bidder placed this!)</span>
                <span>★ WINNER! (Lowest Unique)</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-slate-900 text-slate-400">
                <span>1.45 ETB (1 bidder placed this)</span>
                <span>Unique, but higher than 0.18</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Pro Winning Strategies:
            </h4>
            <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
              <li>Avoid round numbers like 0.10, 0.50, 1.00, as they attract high collisions.</li>
              <li>Choose irregular decimals like 1.37, 2.83, or 4.19 ETB.</li>
              <li>Use the <strong>3x Strategic Spread</strong> tool to cover low, middle, and hedge positions.</li>
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onOpenSandbox();
              }}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Practice in Strategy Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};