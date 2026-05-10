'use client';

import { useState } from 'react';
import { withdrawProposal } from '@/lib/actions/proposals';
import { Loader2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function WithdrawProposalButton({ proposalId, status }) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  if (status === 'accepted') {
    return null; // Cannot withdraw accepted
  }

  const handleWithdraw = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to withdraw this proposal?')) return;
    
    setIsWithdrawing(true);
    try {
      await withdrawProposal(proposalId);
      toast.success('Proposal withdrawn successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to withdraw proposal');
      setIsWithdrawing(false);
    }
  };

  return (
    <button
      onClick={handleWithdraw}
      disabled={isWithdrawing}
      className="p-2 rounded-xl hover:bg-[#ffebee] text-red-400 hover:text-red-600 transition-colors"
      title="Withdraw Proposal"
    >
      {isWithdrawing ? <Loader2 className="h-5 w-5 animate-spin" /> : <XCircle className="h-5 w-5" />}
    </button>
  );
}
