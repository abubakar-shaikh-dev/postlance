'use client';

import { useState } from 'react';
import { topUpWallet } from '@/lib/actions/wallet';
import { Plus, X, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const PRESETS = [500, 1000, 2000, 5000];

export function TopUpDialog() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTopUp = async (value) => {
    const amt = Number(value || amount);
    if (!amt || amt <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    setLoading(true);
    const result = await topUpWallet(amt);
    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      setAmount('');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-filled-2 h-12 flex items-center justify-center px-6 text-[15px] gap-2"
      >
        <Plus className="h-5 w-5" />
        Top Up Wallet
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#181717]/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative bg-white rounded-[32px] border border-border/10 w-full max-w-md p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-medium text-[#181717]">Top Up Wallet</h2>
          <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-[#f9f7f6]">
            <X className="h-5 w-5 text-[#666666]" />
          </button>
        </div>

        <p className="text-[14px] text-[#666666] mb-6">
          This is a mock top-up. Select an amount or enter a custom value.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handleTopUp(preset)}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-border/20 hover:border-[#d04841]/30 hover:bg-[#f9f7f6] text-[15px] font-medium text-[#181717] transition-all disabled:opacity-50"
            >
              <IndianRupee className="h-4 w-4" />
              {preset.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-medium text-[#666666]">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Custom amount"
              className="w-full h-12 pl-8 pr-4 rounded-xl border border-border/20 bg-[#f9f7f6] text-[16px] font-medium text-[#181717] placeholder:text-[#999] outline-none focus:border-[#d04841]/40"
            />
          </div>
          <button
            onClick={() => handleTopUp()}
            disabled={loading || !amount}
            className="btn-filled-2 h-12 px-6 text-[15px] disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
