import React, { useState } from 'react';
import { X, Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2, CreditCard, Smartphone, Building, RefreshCw } from 'lucide-react';
import { UserProfile, WalletTransaction, PaymentMethod } from '../types/auction';
import { formatETB, formatUSD } from '../utils/lubEngine';

interface WalletModalProps {
  user: UserProfile;
  currency: 'ETB' | 'USD';
  transactions: WalletTransaction[];
  onClose: () => void;
  onDeposit: (amount: number, method: PaymentMethod) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  user,
  currency,
  transactions,
  onClose,
  onDeposit,
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'history'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('telebirr');
  const [depositAmount, setDepositAmount] = useState<string>('500');
  const [phoneNumber, setPhoneNumber] = useState<string>('0911234567');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<{ amount: number; method: string; ref: string } | null>(null);

  const presets = [250, 500, 1000, 2500, 5000];

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    setIsProcessing(true);
    setReceipt(null);

    setTimeout(() => {
      onDeposit(amt, selectedMethod);
      setIsProcessing(false);
      setReceipt({
        amount: amt,
        method: selectedMethod,
        ref: `${selectedMethod.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-ET`,
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative my-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>ADDIS WALLET</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-semibold">SECURE & INSTANT</span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                Wallet & Bid Credit Management
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

        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Available Bidding Balance
              </span>
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tabular-nums mt-1">
                {currency === 'ETB' ? formatETB(user.walletBalanceETB) : formatUSD(user.walletBalanceETB / 130)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Account Holder: <span className="text-slate-200 font-medium">{user.name}</span> · {user.phone}
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
              <div className="flex justify-between gap-4 text-slate-400">
                <span>Total Bids Placed:</span>
                <span className="font-mono text-white font-bold">{user.totalBidsPlaced}</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-400">
                <span>Auctions Won:</span>
                <span className="font-mono text-amber-400 font-bold">{user.winsCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 pb-0">
          <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                activeTab === 'deposit'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Deposit Funds
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Transaction Ledger ({transactions.length})
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {activeTab === 'deposit' ? (
            <div className="space-y-6">
              {receipt && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Deposit of {formatETB(receipt.amount)} Verified!</span>
                  </div>
                  <div className="text-slate-300">
                    Funds have been credited to your Addis Bid balance. Reference Code:{' '}
                    <span className="font-mono text-white font-semibold">{receipt.ref}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Select Payment Channel
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('telebirr')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMethod === 'telebirr'
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-amber-400 mb-1" />
                    <div className="font-bold text-xs">telebirr</div>
                    <div className="text-[10px] text-slate-500">Ethio telecom</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cbe_birr')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMethod === 'cbe_birr'
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Building className="w-5 h-5 text-purple-400 mb-1" />
                    <div className="font-bold text-xs">CBE Birr</div>
                    <div className="text-[10px] text-slate-500">Commercial Bank</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('chapa')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMethod === 'chapa'
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-400 mb-1" />
                    <div className="font-bold text-xs">Chapa</div>
                    <div className="text-[10px] text-slate-500">Fast Gateway</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMethod === 'card'
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-cyan-400 mb-1" />
                    <div className="font-bold text-xs">Debit/Credit</div>
                    <div className="text-[10px] text-slate-500">Visa / Mastercard</div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Deposit Amount (ETB)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-400">
                      ETB
                    </span>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full pl-14 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg font-mono text-base font-bold text-white focus:outline-none focus:border-amber-400 tabular-nums"
                      required
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {presets.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDepositAmount(val.toString())}
                        className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                          depositAmount === val.toString()
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        +{val} ETB
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {selectedMethod === 'telebirr' ? 'telebirr Registered Mobile Number' : 'Account Mobile / ID'}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                    placeholder="09... or 07..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-lg transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating with {selectedMethod}...</span>
                    </>
                  ) : (
                    <>
                      <span>Deposit {formatETB(parseFloat(depositAmount) || 0)}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No transactions recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          tx.type === 'deposit'
                            ? 'bg-emerald-400/10 text-emerald-400'
                            : 'bg-amber-400/10 text-amber-400'
                        }`}>
                          {tx.type === 'deposit' ? (
                            <ArrowDownRight className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{tx.description}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Ref: {tx.referenceId} · {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-mono font-bold tabular-nums ${
                          tx.type === 'deposit' ? 'text-emerald-400' : 'text-slate-200'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}{formatETB(tx.amountETB)}
                        </div>
                        <span className="text-[10px] text-emerald-400 font-medium">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};