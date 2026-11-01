import React, { useState } from 'react';
import { X, Play, RotateCcw, Trophy, AlertTriangle, Sparkles, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BidRecord } from '../types/auction';
import { analyzeLUB, formatETB, SAMPLE_BIDDER_NAMES } from '../utils/lubEngine';

interface StrategySandboxProps {
  onClose: () => void;
}

export const StrategySandbox: React.FC<StrategySandboxProps> = ({ onClose }) => {
  const [userTestBid, setUserTestBid] = useState<string>('1.85');
  const [competitorCount, setCompetitorCount] = useState<number>(8);
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'resolved'>('idle');
  const [simulatedBids, setSimulatedBids] = useState<BidRecord[]>([]);

  const runSimulation = () => {
    const userAmount = parseFloat(userTestBid);
    if (isNaN(userAmount) || userAmount <= 0) return;

    setSimulationState('running');

    const bids: BidRecord[] = [];
    const now = Date.now();

    bids.push({
      id: 'user-sim-bid',
      userId: 'usr_me',
      userName: 'You (Strategist)',
      amount: Number(userAmount.toFixed(2)),
      timestamp: now,
      isUser: true,
    });

    const commonCollisions = [0.01, 0.05, 0.10, 0.25, 0.50, 1.00];

    for (let i = 0; i < competitorCount; i++) {
      const name = SAMPLE_BIDDER_NAMES[i % SAMPLE_BIDDER_NAMES.length];
      let amount: number;

      if (Math.random() < 0.45) {
        amount = commonCollisions[i % commonCollisions.length];
      } else {
        amount = Number((Math.random() * 4.5 + 0.1).toFixed(2));
      }

      bids.push({
        id: `sim-comp-${i}`,
        userId: `usr-sim-${i}`,
        userName: name,
        amount,
        timestamp: now - (i + 1) * 1000,
      });
    }

    setSimulatedBids(bids);

    setTimeout(() => {
      setSimulationState('resolved');
      const analysis = analyzeLUB(bids);
      if (analysis.winningBidRecord?.isUser) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }, 1200);
  };

  const resetSandbox = () => {
    setSimulationState('idle');
    setSimulatedBids([]);
  };

  const analysis = analyzeLUB(simulatedBids);
  const userWon = analysis.winningBidRecord?.isUser;
  const userRecord = simulatedBids.find((b) => b.isUser);
  const isUserDuplicate = userRecord
    ? simulatedBids.filter((b) => Number(b.amount.toFixed(2)) === Number(userRecord.amount.toFixed(2))).length > 1
    : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative my-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>INTERACTIVE LAB</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-semibold">GAME THEORY SIMULATOR</span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                Lowest Unique Bid Strategy Sandbox
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

        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Configure Your Practice Scenario
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Test different bidding strategies in a sandbox against AI-simulated competitors to understand how duplicates collide and how unique winning prices emerge.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Test Secret Bid (ETB)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-400">
                    ETB
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={userTestBid}
                    disabled={simulationState === 'running'}
                    onChange={(e) => setUserTestBid(e.target.value)}
                    className="w-full pl-14 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg font-mono text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex gap-1.5 mt-2">
                  {['0.01', '0.05', '1.14', '2.37', '4.19'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setUserTestBid(preset)}
                      className="px-2 py-0.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-[10px] font-mono text-slate-400 hover:text-slate-200"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Opponents Count: <span className="font-mono text-amber-400">{competitorCount}</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="20"
                  value={competitorCount}
                  disabled={simulationState === 'running'}
                  onChange={(e) => setCompetitorCount(parseInt(e.target.value))}
                  className="w-full accent-amber-400 mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>4 (Low traffic)</span>
                  <span>12 (Medium)</span>
                  <span>20 (Competitive)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={runSimulation}
                disabled={simulationState === 'running'}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Round Simulation</span>
              </button>

              {simulationState !== 'idle' && (
                <button
                  onClick={resetSandbox}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Sandbox</span>
                </button>
              )}
            </div>
          </div>

          {simulationState === 'running' && (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono">Gathering secret submissions and resolving duplicates...</p>
            </div>
          )}

          {simulationState === 'resolved' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border ${
                  userWon
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : isUserDuplicate
                    ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-display font-bold text-base">
                  {userWon ? (
                    <>
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <span>🎉 Victory! You placed the Lowest Unique Bid!</span>
                    </>
                  ) : isUserDuplicate ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      <span>Your bid of {formatETB(parseFloat(userTestBid))} was duplicated!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>Your bid was unique, but higher than the winning price.</span>
                    </>
                  )}
                </div>

                <p className="text-xs mt-1.5 text-slate-400 leading-relaxed">
                  Winning Bid:{' '}
                  <span className="font-mono font-bold text-white">
                    {formatETB(analysis.winningAmount || 0)}
                  </span>{' '}
                  placed by <span className="text-white font-medium">{analysis.winningBidRecord?.userName}</span>.
                  {isUserDuplicate && ' Another player bid your exact price, eliminating both of you.'}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-3 border-b border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Full Round Bid Breakdown</span>
                  <span className="text-slate-500 text-[11px]">Sorted by Amount</span>
                </div>

                <div className="divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
                  {analysis.frequencies.map((freq) => (
                    <div
                      key={freq.amount}
                      className={`p-2.5 flex items-center justify-between text-xs font-mono ${
                        freq.isWinning
                          ? 'bg-amber-400/10 text-amber-300 font-bold'
                          : freq.isUnique
                          ? 'text-slate-200'
                          : 'bg-rose-950/15 text-slate-500 line-through'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="tabular-nums font-bold">
                          {formatETB(freq.amount)}
                        </span>
                        <span className="font-sans text-[11px] not-italic">
                          ({freq.bidders.join(', ')})
                        </span>
                      </div>

                      <div className="font-sans text-[11px] not-italic">
                        {freq.isWinning ? (
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            WINNER (Lowest & Unique)
                          </span>
                        ) : freq.isUnique ? (
                          <span className="text-slate-400">Unique (Higher)</span>
                        ) : (
                          <span className="text-rose-400">
                            Cancelled Out ({freq.count} duplicate bids)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Strategic Takeaway: </span>
                  Most inexperienced bidders bid 0.01 or 0.02, which almost always results in collisions. Successful bidders pick unconventional decimal amounts between 1.00 and 5.00 ETB!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};