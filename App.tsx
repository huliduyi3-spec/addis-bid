import React, { useState } from 'react';
import { AdminPanel } from './AdminPanel';

export function App() {
  const [auctionSettings, setAuctionSettings] = useState({
    minPrice: 1,
    maxPrice: 1000,
    auctionStatus: 'active',
  });

  const handleUpdateSettings = (newSettings: { minPrice: number; maxPrice: number; auctionStatus: string }) => {
    setAuctionSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="bg-purple-700 text-white p-4 text-center font-bold text-xl">
        Addis Bid (Lowest-Unique-Price Auction)
      </header>

      <main className="p-6">
        <h2 className="text-lg font-semibold mb-2">Current Auction Status:</h2>
        <p>Status: {auctionSettings.auctionStatus}</p>
        <p>Min Price: {auctionSettings.minPrice} ETB</p>
        <p>Max Price: {auctionSettings.maxPrice} ETB</p>
      </main>

      {/* Admin Panel Component Integration */}
      <AdminPanel 
        currentSettings={auctionSettings} 
        onUpdateSettings={handleUpdateSettings} 
      />
    </div>
  );
}

export default App;
