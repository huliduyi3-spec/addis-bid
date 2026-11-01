import React, { useState } from 'react';

interface AdminPanelProps {
  onUpdateSettings: (settings: { minPrice: number; maxPrice: number; auctionStatus: string }) => void;
  currentSettings: { minPrice: number; maxPrice: number; auctionStatus: string };
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onUpdateSettings, currentSettings }) => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Admin Secret PIN
  const ADMIN_PIN = '1234';

  const [minPrice, setMinPrice] = useState(currentSettings.minPrice);
  const [maxPrice, setMaxPrice] = useState(currentSettings.maxPrice);
  const [auctionStatus, setAuctionStatus] = useState(currentSettings.auctionStatus);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect PIN code!');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ minPrice, maxPrice, auctionStatus });
    alert('Auction settings updated successfully!');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isAdminOpen ? (
        <button
          onClick={() => setIsAdminOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          ⚙️ Admin Panel
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl p-6 w-80 border border-gray-200 text-black">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-purple-800">Addis Bid Admin</h3>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="text-gray-500 hover:text-red-500 font-bold"
            >
              ✕
            </button>
          </div>

          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-sm text-gray-600">Enter your secret PIN:</p>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN (e.g: 1234)"
                className="w-full border rounded p-2 text-center tracking-widest"
                maxLength={4}
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Min Price:</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Max Price:</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Auction Status:</label>
                <select
                  value={auctionStatus}
                  onChange={(e) => setAuctionStatus(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
