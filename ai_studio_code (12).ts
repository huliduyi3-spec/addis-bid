import React, { useState } from 'react';
import { X, Trophy, CheckCircle2, MapPin, Truck, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuctionItem, UserProfile } from '../types/auction';
import { formatETB } from '../utils/lubEngine';

interface ClaimPrizeModalProps {
  item: AuctionItem;
  user: UserProfile;
  winningAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const ClaimPrizeModal: React.FC<ClaimPrizeModalProps> = ({
  item,
  user,
  winningAmount,
  onClose,
  onSuccess,
}) => {
  const [district, setDistrict] = useState<string>('Bole Medhanialem');
  const [addressLine, setAddressLine] = useState<string>('Behind Edna Mall, House #204');
  const [phone, setPhone] = useState<string>(user.phone);
  const [deliveryType, setDeliveryType] = useState<'courier' | 'hub'>('courier');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [claimId, setClaimId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `ADDIS-PRIZE-${Math.floor(100000 + Math.random() * 900000)}`;
    setClaimId(generatedId);
    setIsSubmitted(true);

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative my-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>OFFICIAL PRIZE CLAIM</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-semibold">AUTHENTICATED WINNER</span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                Claim {item.title}
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
          {isSubmitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-display font-bold text-white">
                  Prize Claim Confirmed!
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                  Your winning item is being prepared for dispatch in Addis Ababa. Our logistics officer will contact you within 2 business hours.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Dispatch Reference:</span>
                  <span className="font-mono font-bold text-amber-400">{claimId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="text-white">{district}, Addis Ababa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Final Strike Price:</span>
                  <span className="font-mono text-emerald-400 font-bold">{formatETB(winningAmount)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="py-2.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Return to Auctions
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 object-cover rounded-lg bg-slate-900 border border-slate-800 shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-xs sm:text-sm">{item.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>Retail: {formatETB(item.retailValueETB)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      Your Price: {formatETB(winningAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Delivery Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('courier')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryType === 'courier'
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-amber-400 mb-1" />
                    <div className="font-bold text-xs">Direct Courier</div>
                    <div className="text-[10px] text-slate-500">To your door in Addis</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('hub')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryType === 'hub'
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <MapPin className="w-5 h-5 text-emerald-400 mb-1" />
                    <div className="font-bold text-xs">Hub Pickup</div>
                    <div className="text-[10px] text-slate-500">Bole Medhanialem Centre</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Addis Ababa Sub-City / District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Bole Medhanialem">Bole (Medhanialem, Rwanda, Atlas)</option>
                  <option value="Kazanchis">Kazanchis / Kirkos</option>
                  <option value="Piassa / Arada">Piassa / Arada</option>
                  <option value="Old Airport / Sarbet">Old Airport / Sarbet</option>
                  <option value="CMC / Ayat">CMC / Ayat / Yeka</option>
                  <option value="Megenagna">Megenagna</option>
                  <option value="Akaki Kality">Akaki Kality</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Street / Landmark Address
                </label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Building, Floor, House number"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Contact Phone for Delivery Dispatch
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Final Release & Delivery</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};