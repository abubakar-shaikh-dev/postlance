'use client';

import { ArrowDownLeft, ArrowUpRight, Wallet, Briefcase } from 'lucide-react';

export function TransactionList({ transactions = [] }) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white border border-border/10 rounded-[24px]">
        <div className="h-12 w-12 bg-[#f9f7f6] rounded-full border border-border/10 flex items-center justify-center mx-auto mb-4">
          <Wallet className="h-6 w-6 text-[#666666]" />
        </div>
        <h3 className="text-[16px] font-medium text-[#181717] mb-1">No transactions yet</h3>
        <p className="text-[14px] text-[#666666]">Transactions will appear here once you start using your wallet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((tx, i) => {
        const isCredit = tx.type === 'credit';

        return (
          <div
            key={tx._id || i}
            className="flex items-center justify-between p-5 bg-white rounded-[20px] border border-border/10 hover:border-border/20 transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isCredit
                    ? 'bg-[#cbf4c9] text-[#181717]'
                    : 'bg-[#ffd3cf] text-[#d04841]'
                }`}
              >
                {isCredit ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-[#181717] truncate">
                  {tx.description}
                </p>
                <div className="flex items-center gap-2 text-[13px] text-[#666666] mt-0.5">
                  <span>
                    {new Date(tx.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {tx.projectId && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[#eeebea]" />
                      <span className="flex items-center gap-1 text-[#5a82de]">
                        <Briefcase className="h-3 w-3" />
                        Project
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="shrink-0 text-right ml-4">
              <p
                className={`text-[16px] font-medium tabular-nums ${
                  isCredit ? 'text-[#181717]' : 'text-[#d04841]'
                }`}
              >
                {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString()}
              </p>
              <p className="text-[11px] font-medium text-[#666666] uppercase tracking-wide mt-0.5">
                {isCredit ? 'Cr' : 'Dr'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
