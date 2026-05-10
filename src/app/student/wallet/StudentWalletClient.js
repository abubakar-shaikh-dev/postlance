'use client';

import CountUp from 'react-countup';
import { Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { TransactionList } from '@/components/wallet/TransactionList';
import { WithdrawDialog } from '@/components/wallet/WithdrawDialog';

export function StudentWalletClient({ wallet }) {
  const balance = wallet?.balance || 0;
  const transactions = wallet?.transactions || [];
  const totalEarned = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawn = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="w-full mx-auto py-12 px-4 md:px-8 max-w-7xl">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-[#cbf4c9] text-[#181717] rounded text-[13px] font-medium mb-4">
          <Wallet className="h-4 w-4 mr-2" />
          My Wallet
        </div>
        <h1 className="text-4xl md:text-[48px] font-medium text-[#181717] tracking-tight">
          Wallet
        </h1>
        <p className="text-[16px] text-[#666666] mt-2">
          Track your earnings and withdraw funds.
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-[#cedefd] p-8 md:p-10 rounded-[32px] mb-8">
        <p className="text-[14px] font-medium text-[#181717]/60 mb-2 uppercase tracking-wide">
          Available Balance
        </p>
        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-[14px] font-medium text-[#181717]/50">₹</span>
          <span className="text-[56px] md:text-[64px] font-medium text-[#181717] leading-none tabular-nums">
            <CountUp end={balance} duration={1.5} separator="," />
          </span>
        </div>

        <WithdrawDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-white p-6 rounded-[24px] border border-border/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-[#cbf4c9] flex items-center justify-center">
              <ArrowDownLeft className="h-5 w-5 text-[#181717]" />
            </div>
            <p className="text-[13px] font-medium text-[#666666]">Total Earned</p>
          </div>
          <p className="text-[28px] font-medium text-[#181717] tabular-nums">
            ₹<CountUp end={totalEarned} duration={1.5} separator="," />
          </p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-border/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-[#ffd3cf] flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-[#d04841]" />
            </div>
            <p className="text-[13px] font-medium text-[#666666]">Total Withdrawn</p>
          </div>
          <p className="text-[28px] font-medium text-[#181717] tabular-nums">
            ₹<CountUp end={totalWithdrawn} duration={1.5} separator="," />
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <h2 className="text-[24px] font-medium text-[#181717] mb-6">Transaction History</h2>
      <TransactionList transactions={transactions} />
    </div>
  );
}
